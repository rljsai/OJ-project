import logo from './utilities/logo.png';
import profile from './utilities/profile.jpg';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const COMPILER_URL = import.meta.env.VITE_COMPILER_SERVER_URL;

const difficultyColors = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400"
};



function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedCode, setSelectedCode] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || '');
      setEmail(decoded.email || '');
      setRole(decoded.role || '');
    } catch (err) {
      navigate("/");
    }

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${COMPILER_URL}/getallsubmissions`, {
          headers: {
            auth: token,
            'Content-Type': 'application/json'
          }
        });

        if (Array.isArray(response.data?.submissions)) {
          setSubmissions(response.data.submissions);
        } else if (Array.isArray(response.data)) {
          setSubmissions(response.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setSubmissions([]);
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setSubmissions([]);
      }
    };

    fetchSubmissions();
  }, [token, navigate]);

  const filteredSubmissions = (Array.isArray(submissions) ? submissions : []).filter((submission) => {
    const title = submission?.problem?.title || "";
    const difficulty = submission?.problem?.difficulty || "";
    return title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || difficulty === filter);
  });

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0d0315] flex flex-col items-center py-0 relative">
      {/* Top Bar */}
      <nav className="bg-white border-gray-200 dark:bg-[#0d0315] shadow w-full">
        <div className="w-full flex items-center justify-between px-8 py-4 max-w-[1600px] mx-auto">

          <div className="flex items-center">
            <img className="w-12 h-12 mr-4" src={logo} alt="logo" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">CodeShuriken</span>
          </div>


          <Link to="/user-home" className="bg-[#232336] hover:bg-[#A020F0] text-white font-semibold px-5 py-2 rounded-lg transition shadow text-sm">

             Back to Home</Link>

        </div>
      </nav>

      <div className="w-full max-w-7xl bg-white dark:bg-[#18122B] rounded-2xl shadow-2xl p-10 mt-12 mb-12 flex flex-col md:flex-row items-center gap-10">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={profile}
            alt="Profile Avatar"
            className="w-44 h-44 rounded-full border-4 border-[#A020F0] shadow-lg"
          />
        </div>

        {/* User Info */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            <span className="text-gray-300 font-medium">Username:</span> {username}
          </h2>

          <p className="text-base sm:text-lg text-gray-400">
            <span className="text-gray-300 font-medium">Email:</span> {email}
          </p>

          <span className="inline-block mt-2 px-4 py-1 text-sm sm:text-base font-medium rounded-full bg-[#A020F0] text-white shadow-sm">
            role: <span className="font-semibold">{role}</span>
          </span>

          <button
            onClick={handleSignOut}
            className="mt-5 w-40 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold text-base sm:text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sign Out
          </button>
        </div>

      </div>


      {/* Submission Table Section */}
      <div className="flex justify-center w-full mt-6 px-2">
        <div className="bg-white dark:bg-[#18122B] rounded-2xl shadow-2xl p-10 w-full max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Submissions {submissions.length > 0 && `(${submissions.length})`}
            </h2>
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search Submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A020F0] w-full md:w-80 text-base"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#A020F0] w-full md:w-auto custom-select-purple"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-base">
              <thead className="bg-gray-100 dark:bg-[#232336]">
                <tr>
                  {["#", "Title", "Language", "Difficulty", "Verdict", "Timestamp", "Code"].map((head, idx) => (
                    <th key={idx} className="px-6 py-4 text-left text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 text-base">
                      {submissions.length === 0 ? "No submissions found." : "No submissions match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission, idx) => {
                    const problem = submission?.problem || {};
                    return (
                      <tr key={submission._id || idx} className={`transition-colors hover:bg-gray-100 dark:hover:bg-[#A020F0]/10 ${idx % 2 === 0 ? 'bg-white dark:bg-[#18122B]' : 'bg-gray-100 dark:bg-[#232336]'}`}>
                        <td className="px-6 py-4 text-white">{idx + 1}</td>
                        <td className="px-6 py-4 text-[#A020F0] font-semibold">
                          <Link to={`/problem/${problem._id}`} className="hover:underline">{problem.title}</Link>
                        </td>
                        <td className="px-6 py-4 text-white">{submission.language}</td>
                        <td className={`px-6 py-4 font-bold ${difficultyColors[problem.difficulty]}`}>{problem.difficulty || '-'}</td>
                        <td className="px-6 py-4 text-white">{submission.verdict}</td>
                        <td className="px-6 py-4 text-white">{submission.createdAt ? new Date(submission.createdAt).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedCode(submission.code)}
                            className="text-[#A020F0] underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Code Viewer Modal */}
      {selectedCode !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2f] w-11/12 max-w-4xl rounded-lg shadow-lg border border-[#A020F0] overflow-hidden">
            <div className="flex justify-between items-center p-3 bg-[#292A40] border-b border-[#A020F0]">
              <h2 className="text-white font-semibold text-lg">Submitted Code</h2>
              <button onClick={() => setSelectedCode(null)} className="text-gray-400 hover:text-white text-xl px-2">&times;</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4 bg-[#18181b] text-white text-sm custom-scrollbar whitespace-pre-wrap break-words font-mono">
              <pre>{selectedCode}</pre>
            </div>
          </div>
        </div>
      )}


      {/* Custom Select Styling */}
      <style>{`
        select.custom-select-purple {
          background-color: #18122B !important;
          color: #fff !important;
        }
        select.custom-select-purple option {
          background-color: #18122B !important;
          color: #fff !important;
        }
        select.custom-select-purple option:hover, select.custom-select-purple option:focus {
          background-color: #A020F0 !important;
          color: #fff !important;
        }
        select.custom-select-purple option:checked {
          background-color: #A020F0 !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  );
}

export default ProfilePage;