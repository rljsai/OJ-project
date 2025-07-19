import React, { useState, useRef, useEffect } from "react";
import logo from "./utilities/logo.png";
import profile from "./utilities/profile.jpg";
import axios from 'axios';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const difficultyColors = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400"
};




function UserHome() {

    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const [problems, setProblems] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const profileRef = useRef();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
   const [isAdmin, setIsAdmin] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    const [showModifyModal, setShowModifyModal] = useState(false);
    const [editProblem, setEditProblem] = useState(null);
    const [editError, setEditError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [newProblem, setNewProblem] = useState({
        title: "",
        description: "",
        difficulty: "Easy",
        testcases: [{ input: "", ExpectedOutput: "" }]
    });
    const [addError, setAddError] = useState("");



    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.error("No auth token found.");
                    return;
                }

                const response = await axios.get(`${SERVER_URL}/problemset`, {
                    headers: {
                        auth: token
                    }
                });
                setProblems(response.data);
            } catch (err) {
                console.error("Error fetching problems:", err.response?.data || err.message);
            }
        };

        fetchProblems();
    }, []);
    

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username || '');
            setRole(decoded.role || '');
            setIsAdmin(decoded.role === 'admin');
        } catch (err) {
            navigate("/");
        }


    }, [token, navigate]);



    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || problem.difficulty === filter;
        return matchesSearch && matchesFilter;
    });

    const handleTestcaseChange = (index, field, value) => {
        const updatedTestcases = [...newProblem.testcases];
        updatedTestcases[index][field] = value;
        setNewProblem({ ...newProblem, testcases: updatedTestcases });
    };

    const addTestcaseField = () => {
        setNewProblem(prev => ({
            ...prev,
            testcases: [...prev.testcases, { input: "", ExpectedOutput: "" }]
        }));
    };

    const removeTestcaseField = (index) => {
        const updated = [...newProblem.testcases];
        updated.splice(index, 1);
        setNewProblem({ ...newProblem, testcases: updated });
    };

    const handleAddProblem = async () => {
        setAddError("");

        if (!newProblem.title || !newProblem.description || !newProblem.testcases.length) {
            setAddError("Please fill in all required fields.");
            return;
        }

        try {
            const res = await axios.post(`${SERVER_URL}/problemset/add`, newProblem, {
                headers: { auth: token }
            });

            setProblems(prev => [...prev, {
                ...newProblem,
                _id: Date.now().toString(), 
                score: newProblem.difficulty === 'Easy' ? 30 :
                    newProblem.difficulty === 'Medium' ? 60 : 100
            }]);

            setShowAddModal(false);
            setNewProblem({ title: "", description: "", difficulty: "Easy", testcases: [{ input: "", ExpectedOutput: "" }] });
        } catch (err) {
            console.error("Add error", err);
            setAddError(err.response?.data?.error || "Failed to add problem.");
        }
    };


  const handleUpdateProblem = async () => {
        setEditError("");

        if (!editProblem.title || !editProblem.description || !editProblem.testcases.length) {
            setEditError("Please fill in all required fields.");
            return;
        }

        try {
            await axios.patch(`${SERVER_URL}/problemset/${editProblem._id}/modify`, editProblem, {
                headers: { auth: token },
            });

           
            setProblems(prev =>
                prev.map(p => (p._id === editProblem._id ? { ...p, ...editProblem } : p))
            );

            setShowModifyModal(false);
            setEditProblem(null);
        } catch (err) {
            console.error("Modify error", err);
            setEditError(err.response?.data?.message || "Failed to modify problem.");
        }
    };


const handleDelete = async () => {
        try {
            await axios.delete(`${SERVER_URL}/problemset/${selectedProblem._id}/delete`, {
                headers: {
                    auth: token
                }
            });

            setProblems(prev => prev.filter(p => p._id !== selectedProblem._id));
            setShowDeleteModal(false);
            setSelectedProblem(null);
        } catch (error) {
            console.error("Error deleting problem:", error.response?.data || error.message);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0d0315]">
            <nav className="bg-white border-gray-200 dark:bg-[#0d0315] shadow w-full">
                <div className="w-full flex items-center justify-between px-8 py-4 max-w-[1600px] mx-auto">

                    <div className="flex items-center">
                        <img className="w-12 h-12 mr-4" src={logo} alt="logo" />
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">codeshuriken</span>
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            type="button"
                            className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 px-2 py-1"
                            onClick={() => setProfileMenuOpen((open) => !open)}
                        >
                            <img
                                className="w-12 h-12 rounded-full border-2 border-[#A020F0]"
                                src={profile}
                                alt="user profile"
                            />
                            <span className="ml-3 text-white font-semibold hidden sm:block pr-2">
                                {username}
                            </span>
                        </button>


                        {
                            profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#A020F0] hover:text-white rounded-t-lg transition-colors"
                                                to="/profile"
                                            >
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#A020F0] hover:text-white rounded-b-lg transition-colors"
                                                onClick={() => {
                                                    localStorage.removeItem("authToken");
                                                    window.location.href = "/";
                                                }}
                                            >
                                                Sign out
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                            )}
                    </div>

                </div>
            </nav>


            {/* Problems Section Box */}
            <div className="flex justify-center w-full mt-6 px-2">
                <div className="bg-white dark:bg-[#18122B] rounded-2xl shadow-2xl p-10 w-full max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Problems</h2>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-6 w-full md:w-auto">
                            {isAdmin && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Add Problem
                                </button>
                            )}

                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A020F0] w-full md:w-80 text-base"
                            />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-900 dark:bg-gray-900 text-gray-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A020F0] focus:border-[#A020F0] w-full md:w-auto custom-select-purple"
                            >
                                <option value="All">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Problems Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-base">
                            <thead className="bg-gray-100 dark:bg-[#232336]">
                                <tr>
                                    <th className="px-8 py-4 text-left text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-8 py-4 text-left text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-8 py-4 text-left text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difficulty</th>
                                    <th className="px-8 py-4 text-left text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                                    {isAdmin && <th className="px-8 py-4 text-left text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProblems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-6 text-center text-gray-500 dark:text-gray-400 text-base">
                                            No problems found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProblems.map((problem, idx) => (
                                        <tr
                                            key={problem._id || idx}
                                            className={`transition-colors hover:bg-gray-100 dark:hover:bg-[#A020F0]/10 ${idx % 2 === 0
                                                ? 'bg-white dark:bg-[#18122B]'
                                                : 'bg-gray-100 dark:bg-[#232336]'
                                                }`}
                                        >
                                            <td className="px-8 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white">{idx + 1}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-base text-[#A020F0] font-semibold cursor-pointer"><Link
                                                to={`/problem/${problem._id}`}
                                                className="text-[#A020F0] hover:underline"
                                            >
                                                {problem.title}
                                            </Link></td>
                                            <td className={`px-8 py-4 whitespace-nowrap text-base font-bold ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">{problem.score}</td>
                                            {isAdmin && <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProblem(problem);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditProblem(problem); 
                                                        setShowModifyModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                                >
                                                    Modify
                                                </button>


                                            </td>}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Custom style for select dropdown */}
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

            {showDeleteModal && selectedProblem && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-[#18122B] border border-[#A020F0] p-6 rounded-2xl shadow-2xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Are you sure you want to delete <span className="text-[#A020F0] font-bold">"{selectedProblem.title}"</span>?
                        </h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 border border-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 border border-red-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-[#18122B] border border-[#A020F0] p-6 rounded-2xl shadow-2xl max-w-2xl w-full relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Add Problem</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full p-3 rounded border border-gray-700 bg-[#232336] text-white"
                                value={newProblem.title}
                                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                            />

                            <textarea
                                placeholder="Description"
                                className="w-full p-3 rounded border border-gray-700 bg-[#232336] text-white"
                                rows="3"
                                value={newProblem.description}
                                onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                            />

                            <select
                                value={newProblem.difficulty}
                                onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                                className="w-full p-3 rounded border border-gray-700 bg-[#232336] text-white"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Testcases</h4>
                                {newProblem.testcases.map((tc, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Input"
                                            value={tc.input}
                                            onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                                            className="w-1/2 p-2 border border-gray-700 rounded bg-[#232336] text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Expected Output"
                                            value={tc.ExpectedOutput}
                                            onChange={(e) => handleTestcaseChange(index, "ExpectedOutput", e.target.value)}
                                            className="w-1/2 p-2 border border-gray-700 rounded bg-[#232336] text-white"
                                        />
                                        {newProblem.testcases.length > 1 && (
                                            <button
                                                onClick={() => removeTestcaseField(index)}
                                                className="text-red-400 hover:text-red-600 text-lg font-bold"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addTestcaseField} className="text-sm text-[#A020F0] hover:underline mt-2">+ Add Testcase</button>
                            </div>

                            {addError && <p className="text-red-400">{addError}</p>}

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 border border-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddProblem}
                                    className="px-4 py-2 bg-[#A020F0] text-white rounded hover:bg-[#7c16b3] border border-[#A020F0]"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModifyModal && editProblem && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-[#18122B] border border-[#A020F0] p-6 rounded-2xl shadow-2xl max-w-2xl w-full relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Modify Problem</h3>
                            <button onClick={() => setShowModifyModal(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full p-3 rounded border border-gray-700 bg-[#232336] text-white"
                                value={editProblem.title}
                                onChange={(e) => setEditProblem({ ...editProblem, title: e.target.value })}
                            />

                            <textarea
                                placeholder="Description"
                                className="w-full p-3 rounded border border-gray-700 bg-[#232336] text-white"
                                rows="3"
                                value={editProblem.description}
                                onChange={(e) => setEditProblem({ ...editProblem, description: e.target.value })}
                            />

                            <select
                                value={editProblem.difficulty}
                                onChange={(e) => setEditProblem({ ...editProblem, difficulty: e.target.value })}
                                className="w-full p-3 rounded border border-gray-700 bg-[#232336] text-white"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Testcases</h4>
                                {editProblem.testcases.map((tc, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Input"
                                            value={tc.input}
                                            onChange={(e) => {
                                                const newTCs = [...editProblem.testcases];
                                                newTCs[index].input = e.target.value;
                                                setEditProblem({ ...editProblem, testcases: newTCs });
                                            }}
                                            className="w-1/2 p-2 border border-gray-700 rounded bg-[#232336] text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Expected Output"
                                            value={tc.ExpectedOutput}
                                            onChange={(e) => {
                                                const newTCs = [...editProblem.testcases];
                                                newTCs[index].ExpectedOutput = e.target.value;
                                                setEditProblem({ ...editProblem, testcases: newTCs });
                                            }}
                                            className="w-1/2 p-2 border border-gray-700 rounded bg-[#232336] text-white"
                                        />
                                        {editProblem.testcases.length > 1 && (
                                            <button
                                                onClick={() => {
                                                    const updated = [...editProblem.testcases];
                                                    updated.splice(index, 1);
                                                    setEditProblem({ ...editProblem, testcases: updated });
                                                }}
                                                className="text-red-400 hover:text-red-600 text-lg font-bold"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() =>
                                        setEditProblem((prev) => ({
                                            ...prev,
                                            testcases: [...prev.testcases, { input: "", ExpectedOutput: "" }],
                                        }))
                                    }
                                    className="text-sm text-[#A020F0] hover:underline mt-2"
                                >
                                    + Add Testcase
                                </button>
                            </div>

                            {editError && <p className="text-red-400">{editError}</p>}

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    onClick={() => setShowModifyModal(false)}
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 border border-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateProblem}
                                    className="px-4 py-2 bg-[#A020F0] text-white rounded hover:bg-[#7c16b3] border border-[#A020F0]"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}

export default UserHome;
