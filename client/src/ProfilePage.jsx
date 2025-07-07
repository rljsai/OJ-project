import logo from './utilities/logo.png';
import profile from './utilities/profile.jpg';
import { useState } from 'react';

function CircularProgress({ value, max, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  return (
    <svg width={size} height={size} className="block mx-auto">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#232336"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#A020F0"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.5rem"
        fill="#fff"
        fontWeight="bold"
      >
        {value}
      </text>
    </svg>
  );
}

function ProfilePage() {
  // Placeholder user data
  const user = {
    username: 'CodeShirukenUser',
    email: 'user@codeshiruken.com',
    joined: 'January 2024',
    role: 'Member',
  };
  // Placeholder stats
  const stats = {
    solved: 0,
    total: 3610,
    attempting: 0,
    easy: 0,
    easyTotal: 885,
    medium: 0,
    mediumTotal: 1877,
    hard: 0,
    hardTotal: 848,
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0d0315] flex flex-col items-center py-0 relative">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-8 py-8 fixed top-0 left-0 z-10 bg-transparent">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">CodeShiruken</span>
        </div>
        <a href="#" className="bg-[#232336] hover:bg-[#A020F0] text-white font-semibold px-5 py-2 rounded-lg transition shadow text-sm">Back to Home</a>
      </div>
      {/* Spacer for fixed top bar */}
      <div className="h-24" />
      {/* Profile Card with Grid Layout */}
      <div className="w-full max-w-7xl min-h-[540px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-16 mt-12 mb-12 grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-10 items-center">
        {/* Profile Icon Left */}
        <div className="col-span-12 md:col-span-3 flex flex-col items-center md:items-center justify-center h-full">
          <img src={profile} alt="Profile" className="w-44 h-44 rounded-full border-4 border-[#A020F0] shadow-lg mb-4 md:mb-0" />
        </div>
        {/* User Details Center */}
        <div className="col-span-12 md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 leading-tight">{user.username}</h2>
          <p className="text-lg text-gray-500 dark:text-gray-300 mb-1">{user.email}</p>
          <p className="text-base text-gray-400 dark:text-gray-500 mb-2">Joined: {user.joined}</p>
          <span className="inline-block mb-4 px-5 py-1 text-base font-semibold rounded-full bg-[#A020F0] text-white">{user.role}</span>
          <div className="w-full flex flex-col items-center md:items-start gap-3 mt-2">
            <button className="w-48 max-w-full py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">Sign Out</button>
          </div>
        </div>
        {/* Stats Card Right */}
        <div className="col-span-12 md:col-span-4 flex flex-col items-center md:items-end justify-center h-full">
          <div className="bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center min-h-[320px]">
            <CircularProgress value={stats.solved} max={stats.total} size={120} stroke={12} />
            <div className="text-white text-2xl font-bold mt-4">{stats.solved}/{stats.total} <span className="text-base font-normal">Solved</span></div>
            <div className="text-gray-400 text-base mb-4">{stats.attempting} Attempting</div>
            <div className="flex flex-col gap-3 w-full mt-2">
              <div className="flex justify-between items-center w-full">
                <span className="text-cyan-400 font-semibold text-lg">Easy</span>
                <span className="text-white font-bold text-lg">{stats.easy}/{stats.easyTotal}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="text-yellow-400 font-semibold text-lg">Med.</span>
                <span className="text-white font-bold text-lg">{stats.medium}/{stats.mediumTotal}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="text-red-400 font-semibold text-lg">Hard</span>
                <span className="text-white font-bold text-lg">{stats.hard}/{stats.hardTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
