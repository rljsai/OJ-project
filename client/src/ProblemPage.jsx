import { Fragment, useState, useEffect, useRef } from "react";
import { FiMaximize2, FiMinimize2, FiCopy, FiRotateCcw } from "react-icons/fi";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { Link } from "react-router-dom";

import logo from "./utilities/logo.png";
import "./index.css";
import codeicon from "./utilities/code-icon.png";
import profile from "./utilities/profile.jpg";

const MaximizeButton = ({ isMaximized, onClick }) => (
  <button
    onClick={onClick}
    className={`ml-2 p-1 rounded transition-colors ${isMaximized ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] hover:bg-[#A020F0] text-white'}`}
    title={isMaximized ? "Exit Maximize" : "Maximize"}
  >
    {isMaximized ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
  </button>
);

function getTemplateCode(language) {
  switch (language) {
    case "cpp":
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`;
    case "c":
      return `#include <stdio.h>\n\nint main() {\n    // your code goes here\n    return 0;\n}`;
    case "python":
      return `def main():\n    # your code goes here\n    pass\n\nif __name__ == '__main__':\n    main()`;
    case "java":
      return `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        // your code goes here\n    }\n}`;
    default:
      return `function main() {\n  // your code goes here\n}\n\nmain();`;
  }
}

function getLanguageExtension(lang) {
  switch (lang) {
    case "python": return python();
    case "cpp": return cpp();
    case "c": return cpp(); // Use C++ mode for C
    case "java": return java();
    default: return javascript();
  }
}

function ProblemPage() {
  const [maximizedPanel, setMaximizedPanel] = useState(null);
  const [code, setCode] = useState(`function hello() {\n  console.log("Hello, world!");\n}`);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const profileRef = useRef();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    setCode(getTemplateCode(selectedLanguage));
  }, [selectedLanguage]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleResetCode = () => {
    setCode(getTemplateCode(selectedLanguage));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "+") {
        setMaximizedPanel((prev) =>
          prev === "code" ? "question" : prev === "question" ? null : "code"
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderCodeEditor = () => (
    <div className="h-full overflow-auto">
      <CodeMirror
        value={code}
        height="100%"
        extensions={[getLanguageExtension(selectedLanguage)]}
        theme="dark"
        onChange={(value) => setCode(value)}
      />
    </div>
  );

  const renderCodeToolbar = (isMaximized) => (
    <div className="absolute top-2 right-2 flex space-x-2 items-center z-20">
      <div className="flex items-center space-x-2">
        <span className="text-white text-base font-medium">Language</span>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-black border border-white px-3 py-1 rounded text-white text-base outline-none focus:border-[#A020F0] transition-colors custom-select-theme"
          style={{ minWidth: 90 }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
      </div>

      <button
        onClick={handleResetCode}
        className="bg-[#292A40] hover:bg-[#3a3a55] p-1 rounded text-white"
        title="Reset to default code definition"
      >
        <FiRotateCcw size={16} />
      </button>
      <div className="relative">
        <button
          onClick={handleCopyCode}
          className="bg-[#292A40] hover:bg-[#3a3a55] p-1 rounded text-white"
          title="Copy Code"
        >
          <FiCopy size={16} />
        </button>
        {copied && (
          <span className="absolute right-0 top-8 bg-black text-white text-xs rounded px-2 py-1 shadow-lg z-30 whitespace-nowrap" style={{border: '1px solid #A020F0'}}>Code Copied!</span>
        )}
      </div>
      <MaximizeButton
        isMaximized={isMaximized}
        onClick={() => setMaximizedPanel(isMaximized ? null : "code")}
      />
    </div>
  );

  if (maximizedPanel === "question") {
    return (
      <div className="w-full h-screen flex flex-col bg-[#1a0f23]">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-rows-[5%_95%] h-full">
            <div className="row-span-1 bg-[#292A40] flex items-center rounded-t-lg pl-2 space-x-6 text-sm font-medium relative">
              <button className="flex items-center text-[#A020F0] border-b-2 border-[#A020F0] pb-1">
                <span className="ml-1">Description</span>
              </button>
              
              <button className="flex items-center text-gray-400 hover:text-[#A020F0] border-b-2 border-transparent pb-1">
                <span className="ml-1">Submissions</span>
              </button>
              <div className="absolute top-2 right-2">
                <MaximizeButton
                  isMaximized={true}
                  onClick={() => setMaximizedPanel(null)}
                />
              </div>
            </div>
            <div className="row-span-1 overflow-y-auto bg-[#242436] p-4 rounded-b-lg custom-scrollbar">
              {/* Problem content intentionally left empty */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (maximizedPanel === "code") {
    return (
      <div className="w-full h-screen flex flex-col bg-[#18181b]">
        <div className="flex-1 flex flex-col px-6 pt-4 pb-2 min-h-0">
          <div className="bg-[#3c2c4a] rounded-lg shadow-lg flex flex-col h-full">
            <div className="bg-[#292A40] flex items-center pl-2 rounded-t-lg relative h-12">
              <img className="w-6 h-6 mr-1" src={codeicon} alt="codeicon" />
              <span className="text-white font-medium">Code</span>
              {renderCodeToolbar(true)}
              <div className="absolute top-2 right-2">
                <MaximizeButton
                  isMaximized={true}
                  onClick={() => setMaximizedPanel(null)}
                />
              </div>
            </div>
            <div className="flex-1 bg-[#18181b] overflow-hidden rounded-b-lg min-h-0" style={{ position: 'relative' }}>
              <div className="h-full overflow-y-auto p-4 custom-scrollbar" style={{ background: '#18181b', minHeight: 300 }}>
                {renderCodeEditor()}
              </div>
              {/* Bottom options bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 12,
                background: '#232336',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 3
              }}>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="customInputCheckMax" className="accent-[#A020F0]" />
                  <label htmlFor="customInputCheckMax" className="text-gray-300 text-sm select-none">Test against custom input</label>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-5 py-2 rounded border border-[#A020F0] bg-[#292A40] text-white font-semibold text-sm hover:bg-[#3a3a55] transition-colors">Run Code</button>
                  <button className="px-5 py-2 rounded bg-[#A020F0] text-white font-semibold text-sm hover:bg-[#7c1bb3] transition-colors">Submit Code</button>
                </div>
              </div>
              {/* Bottom accent bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 12,
                background: '#1a0f23',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                zIndex: 2
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full flex justify-between items-center px-6 py-2 bg-[#1a0f23]">
        <a href="#" className="flex text-2xl font-bold text-gray-900 dark:text-white">
          <img className="w-10 h-10 mr-1" src={logo} alt="logo" />
          CodeShiruken
        </a>
        <div className="flex items-center space-x-3">
          <Link to="/user-home" className="bg-[#242436] hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Problems
          </Link>
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => setProfileMenuOpen((open) => !open)}
            >
              <img className="w-9 h-9 rounded-full border-2 border-[#A020F0]" src={profile} alt="user profile" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
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
      </div>
      <div className="w-full h-[calc(100vh-56px)] flex bg-[#1a0f23]">
        <div className="w-[48%] h-full overflow-y-auto px-6 py-4 pr-2">
          <div className="grid grid-rows-[5%_95%] h-full">
            <div className="row-span-1 bg-[#292A40] flex items-center rounded-t-lg pl-2 space-x-6 text-sm font-medium relative">
              <button className="flex items-center text-[#A020F0] border-b-2 border-[#A020F0] pb-1">
                <span className="ml-1">Description</span>
              </button>
              
              <button className="flex items-center text-gray-400 hover:text-[#A020F0] border-b-2 border-transparent pb-1">
                <span className="ml-1">Submissions</span>
              </button>
              <div className="absolute top-2 right-2">
                <MaximizeButton
                  isMaximized={maximizedPanel === 'question'}
                  onClick={() => setMaximizedPanel(maximizedPanel === 'question' ? null : 'question')}
                />
              </div>
            </div>
            <div className="row-span-1 overflow-y-auto bg-[#242436] p-4 rounded-b-lg custom-scrollbar">
              {/* Problem content intentionally left empty */}
            </div>
          </div>
        </div>
        <div className="w-[52%] h-full flex flex-col relative">
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col px-4 pt-4 pb-0 min-h-0">
              <div className="bg-[#3c2c4a] rounded-lg shadow-lg flex flex-col h-full">
                <div className="bg-[#292A40] flex items-center pl-2 rounded-t-lg relative h-12">
                  <img className="w-6 h-6 mr-1" src={codeicon} alt="codeicon" />
                  <span className="text-white font-medium">Code</span>
                  {renderCodeToolbar(false)}
                  <div className="absolute top-2 right-2">
                    <MaximizeButton
                      isMaximized={maximizedPanel === 'code'}
                      onClick={() => setMaximizedPanel(maximizedPanel === 'code' ? null : 'code')}
                    />
                  </div>
                </div>
                <div className="flex-1 bg-[#18181b] overflow-hidden rounded-b-lg min-h-0" style={{ position: 'relative' }}>
                  <div className="h-full overflow-y-auto p-4 custom-scrollbar" style={{ background: '#18181b', minHeight: 300 }}>
                    {renderCodeEditor()}
                  </div>
                  {/* Bottom options bar */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 12,
                    background: '#232336',
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 3
                  }}>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="customInputCheck" className="accent-[#A020F0]" />
                      <label htmlFor="customInputCheck" className="text-gray-300 text-sm select-none">Test against custom input</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="px-5 py-2 rounded border border-[#A020F0] bg-[#292A40] text-white font-semibold text-sm hover:bg-[#3a3a55] transition-colors">Run Code</button>
                      <button className="px-5 py-2 rounded bg-[#A020F0] text-white font-semibold text-sm hover:bg-[#7c1bb3] transition-colors">Submit Code</button>
                    </div>
                  </div>
                  {/* Bottom accent bar */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 12,
                    background: '#1a0f23',
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    zIndex: 2
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProblemPage;