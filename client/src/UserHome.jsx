import React, { useState, useRef, useEffect } from "react";
import logo from "./utilities/logo.png";
import profile from "./utilities/profile.jpg";
import axios from 'axios';
import { Link } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const difficultyColors = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400"
};




function WebHome() {
    const [problems, setProblems] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const profileRef = useRef();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || problem.difficulty === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0d0315]">
            <nav className="bg-white border-gray-200 dark:bg-[#0d0315] shadow w-full">
                <div className="w-full flex items-center justify-between px-8 py-4 max-w-[1600px] mx-auto">

                    <div className="flex items-center">
                        <img className="w-12 h-12 mr-4" src={logo} alt="logo" />
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">CodeShiruken</span>
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            onClick={() => setProfileMenuOpen((open) => !open)}
                        >

                            <img className="w-12 h-12 rounded-full border-2 border-[#A020F0]" src={profile} alt="user profile" />
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
                                            <td className="px-8 py-4 whitespace-nowrap text-base text-[#A020F0] font-semibold cursor-pointer hover:underline">{problem.title}</td>
                                            <td className={`px-8 py-4 whitespace-nowrap text-base font-bold ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">{problem.score}</td>
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
        </div>
    );
}

export default WebHome;
