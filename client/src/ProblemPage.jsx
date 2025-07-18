import { Fragment, useState, useEffect, useRef } from "react";
import { FiMaximize2, FiMinimize2, FiCopy, FiRotateCcw, FiFileText, FiRefreshCw } from "react-icons/fi";
import "./index.css";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import { Link } from "react-router-dom";

import logo from "./utilities/logo.png";
import codeicon from "./utilities/code-icon.png";
import profile from "./utilities/profile.jpg";


function getTemplateCode(language) {
  switch (language) {
    case "javascript":
      return `function main() {\n  // your code goes here\n}\n\nmain();`;
    case "c":
      return `#include <stdio.h>\n\nint main() {\n    // your code goes here\n    return 0;\n}`;
    case "python":
      return `def main():\n    # your code goes here\n    pass\n\nif __name__ == '__main__':\n    main()`;
    case "java":
      return `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        // your code goes here\n    }\n}`;
    case "go":
      return `package main\n\nimport "fmt"\n\nfunc main() {\n    // your code goes here\n}`;
    default:
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`;
  }
}


function getLanguageExtension(lang) {
  switch (lang) {
    case "python": return python();
    case "javascript": return javascript();
    case "c": return cpp(); // Use C++ mode for C
    case "java": return java();
    case "go": return go();
    default: return cpp();
  }
}



function ProblemPage() {
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");


  const [copied, setCopied] = useState(false);

  const profileRef = useRef();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [codeEditorHeight, setCodeEditorHeight] = useState(null); // will be set on mount
  const dragRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  // Only one panel can be maximized at a time: 'question', 'code', or null
  const [maximizedPanel, setMaximizedPanel] = useState(null); // null | 'question' | 'code'

  // Bottom bar action states
  const [activeAction, setActiveAction] = useState(null); // 'custom' | 'run' | 'submit' | 'ai-feedback' | null
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [customInputChecked, setCustomInputChecked] = useState(false);

  // Action handlers
  const handleCustomToggle = (checked) => {
    setCustomInputChecked(checked);
    if (checked) {
      setActiveAction('custom');
      setIsExpanded(true);
    } else {
      setActiveAction(null);
      setIsExpanded(false);
    }
  };


  const handleActionClick = (action) => {
    // Auto-deselect custom if it's checked
    if (customInputChecked) {
      setCustomInputChecked(false);
    }
    setActiveAction(action);
    setIsExpanded(true);
  };


  const handleCustomTest = () => {
    // Simulate test execution
    setCustomOutput(`Output for input: ${customInput}\nExecution completed successfully.`);
  };

  // Set initial code editor height to 80% of container height
  useEffect(() => {
    if (containerRef.current && codeEditorHeight === null) {
      const containerHeight = containerRef.current.offsetHeight;
      // Set code editor height so bottom bar is at least 80px tall by default
      setCodeEditorHeight(containerHeight - 80);
    }
  }, [codeEditorHeight]);

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

  // Drag logic for resizer
  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDraggingRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newHeight = e.clientY - containerRect.top - 12; // 12px header
      if (newHeight < 100) newHeight = 100;
      if (newHeight > containerRect.height - 100) newHeight = containerRect.height - 100;
      setCodeEditorHeight(newHeight);
    }
    function handleMouseUp() {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleDragStart = (e) => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'row-resize';
  };

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
        // This logic is no longer needed as maximizePanel is removed
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

  const renderCodeToolbar = () => (
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
          <option value="go">Go</option>
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
      <button
        onClick={() => setMaximizedPanel(maximizedPanel === 'code' ? null : 'code')}
        className="bg-[#292A40] hover:bg-[#3a3a55] p-1 rounded text-white"
        title={maximizedPanel === 'code' ? 'Minimize' : 'Maximize'}
      >
        {maximizedPanel === 'code' ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
      </button>
    </div>
  );

  return (
    <Fragment>

      {/* Topbar */}
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


      {/* Layout */}
      <div className="w-full h-[calc(100vh-56px)] flex gap-x-2 pl-2 bg-[#1a0f23]">


        {(maximizedPanel === null || maximizedPanel === 'question') && (
          <div className={`${maximizedPanel === 'question' ? 'w-full' : 'w-[48%]'} h-full flex`}>

            <div className="flex flex-col flex-1 h-full bg-[#3c2c4a] rounded-lg shadow-lg">

              {/* Tab Header */}
              <div className="bg-[#292A40] flex items-center rounded-t-lg pl-2 h-12 space-x-6 text-sm font-medium relative">

                <button className="flex items-center text-gray-400 hover:text-white pb-1">
                  <FiFileText className="mr-1 text-blue-500" size={18} />
                  <span>Description</span>
                </button>

                <span className="mx-2 h-5 w-px bg-gray-600 inline-block align-middle"></span>

                <button className="flex items-center text-gray-400 hover:text-white pb-1">
                  <FiRefreshCw className="mr-1 text-blue-500" size={18} />
                  <span>Submissions</span>
                </button>

                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#232336] text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMaximizedPanel(maximizedPanel === 'question' ? null : 'question')}
                  title={maximizedPanel === 'question' ? 'Minimize' : 'Maximize'}
                >
                  {maximizedPanel === 'question' ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
                </button>


              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto bg-[#242436] p-4 rounded-b-lg custom-scrollbar">
                {/* Problem content intentionally left empty */}
              </div>


            </div>
          </div>
        )}

        {/* Code Panel */}
        {(maximizedPanel === null || maximizedPanel === 'code') && (
          <div className={`${maximizedPanel === 'code' ? 'w-full' : 'w-[52%]'} h-full flex flex-col relative`}>
            <div ref={containerRef} className="flex flex-col h-full bg-[#242436] rounded-lg shadow-lg">

              {/* Code Header and Toolbar */}
              <div className="bg-[#292A40] flex items-center pl-2 rounded-t-lg relative h-12">
                <img className="w-6 h-6 mr-1" src={codeicon} alt="codeicon" />
                <span className="text-white font-medium">Code</span>
                {renderCodeToolbar()}
              </div>

              {/* Split below header into two scrollable parts with draggable divider */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Part 1: Code Editor */}
                <div style={{height: codeEditorHeight ?? 300, minHeight: 100}} className="overflow-y-auto bg-[#18181b] p-4 custom-scrollbar">
                  {renderCodeEditor()}
                </div>

                {/* Draggable Divider */}
                <div
                  ref={dragRef}
                  onMouseDown={handleDragStart}
                  style={{height: 8, cursor: 'row-resize', background: '#1a0f23'}}
                  className="w-full flex items-center justify-center select-none"
                >
                  <div style={{height: 4, width: 60, borderRadius: 2, background: '#444'}}></div>
                </div>


                {/* Part 2: Run/Submit Bar */}
                <div className={`${isExpanded ? 'min-h-[200px]' : 'min-h-[60px]'} overflow-y-auto bg-[#232336] px-6 py-4 border-t border-[#292A40] rounded-b-lg custom-scrollbar transition-all duration-300 ease-in-out`}>
                  <div className="flex items-center justify-between w-full">

                    <div className="flex items-center gap-3">

                      {/* Custom Input Checkbox */}
                      <input 
                        type="checkbox" 
                        id="customInputCheck" 
                        className="accent-[#A020F0]" 
                        checked={customInputChecked}
                        onChange={(e) => handleCustomToggle(e.target.checked)}
                      />
                      <label htmlFor="customInputCheck" className="text-gray-300 text-sm select-none">Test against custom input</label>
                    </div>

                    {/* AI-feedback, Run, Submit Buttons */}
                    <div className="flex items-center gap-3">

                      {/* AI-feedback Button */}
                      <button 
                        onClick={() => handleActionClick('ai-feedback')}
                        className="px-5 py-2 rounded border border-[#A020F0] text-[#A020F0] bg-transparent font-semibold text-sm hover:bg-[#292A40] hover:text-white transition-colors"
                      >
                        AI-feedback
                      </button>

                      {/* Run Button */}
                      <button 
                        onClick={() => handleActionClick('run')}
                        className="px-5 py-2 rounded border border-[#A020F0] bg-[#292A40] text-white font-semibold text-sm hover:bg-[#3a3a55] transition-colors"
                      >
                        Run Code
                      </button>

                      {/* Submit Button */}
                      <button 
                        onClick={() => handleActionClick('submit')}
                        className="px-5 py-2 rounded bg-[#A020F0] text-white font-semibold text-sm hover:bg-[#7c1bb3] transition-colors"
                      >
                        Submit Code
                      </button>


                    </div>
                  </div>
                  
                  {/* Dynamic Content Area */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#292A40]">

                      {/* Custom Input */}
                      {activeAction === 'custom' && (
                        <div className="space-y-4">

                          {/* Custom Input Label and Textarea */}
                          <div>
                            <label className="block text-gray-300 text-sm mb-2">Custom Input:</label>
                            <textarea
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              className="w-full bg-[#18181b] text-white rounded p-3 border border-[#292A40] focus:border-[#A020F0] resize-y min-h-[80px]"
                              placeholder="Enter your custom input here..."
                            />
                          </div>

                          {/* Test Button */}
                          <button
                            onClick={handleCustomTest}
                            className="px-4 py-2 rounded bg-[#A020F0] text-white font-semibold text-sm hover:bg-[#7c1bb3] transition-colors"
                          >
                            Test
                          </button>

                          {/* Custom Output */}
                          {customOutput && (
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">Output:</label>
                              <div className="w-full bg-[#18181b] text-white rounded p-3 border border-[#292A40] max-h-40 overflow-y-auto">
                                <pre className="whitespace-pre-wrap break-all">{customOutput}</pre>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Run */}
                      {activeAction === 'run' && (
                        <div className="space-y-4">

                          <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                            <span className="text-green-400 font-semibold">✓ Compilation Successful</span>
                          </div>

                          {/* Test Cases */}
                          <div className="space-y-3">
                            <h4 className="text-white font-semibold">Test Cases:</h4>

                            <div className="space-y-2">
                              <div className="bg-[#18181b] rounded p-3 border border-[#292A40]">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-300 text-sm">Test Case 1</span>
                                  <span className="text-green-400 text-sm">✓ Accepted</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-gray-400">Input:</span>
                                    <pre className="text-white mt-1">5</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Expected Output:</span>
                                    <pre className="text-white mt-1">25</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Your Output:</span>
                                    <pre className="text-white mt-1">25</pre>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-[#18181b] rounded p-3 border border-[#292A40]">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-300 text-sm">Test Case 2</span>
                                  <span className="text-green-400 text-sm">✓ Accepted</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-gray-400">Input:</span>
                                    <pre className="text-white mt-1">10</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Expected Output:</span>
                                    <pre className="text-white mt-1">100</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Your Output:</span>
                                    <pre className="text-white mt-1">100</pre>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      {activeAction === 'submit' && (
                        <div className="space-y-4">

                          <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                            <span className="text-green-400 font-semibold">✓ All Test Cases Passed!</span>
                          </div>

                          {/* Final Results */}
                          <div className="space-y-3">
                            <h4 className="text-white font-semibold">Final Results:</h4>
                            <div className="space-y-2">
                              <div className="bg-[#18181b] rounded p-3 border border-[#292A40]">

                                {/* Test Case 1 */}
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-300 text-sm">Test Case 1</span>
                                  <span className="text-green-400 text-sm">✓ Accepted</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-gray-400">Input:</span>
                                    <pre className="text-white mt-1">5</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Expected Output:</span>
                                    <pre className="text-white mt-1">25</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Your Output:</span>
                                    <pre className="text-white mt-1">25</pre>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-[#18181b] rounded p-3 border border-[#292A40]">

                                {/* Test Case 2 */}
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-300 text-sm">Test Case 2</span>
                                  <span className="text-green-400 text-sm">✓ Accepted</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-gray-400">Input:</span>
                                    <pre className="text-white mt-1">10</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Expected Output:</span>
                                    <pre className="text-white mt-1">100</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Your Output:</span>
                                    <pre className="text-white mt-1">100</pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI-feedback */}
                      {activeAction === 'ai-feedback' && (
                        <div className="space-y-4">

                          {/* AI-feedback Title */}
                          <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                            <span className="text-blue-400 font-semibold">🤖 AI Feedback</span>
                          </div>
                          <div className="bg-[#18181b] rounded p-3 border border-[#292A40]">
                            <p className="text-white text-sm leading-relaxed">
                              Your code looks good! Here are some suggestions for improvement:
                            </p>
                            <ul className="text-gray-300 text-sm mt-3 space-y-1 list-disc list-inside">
                              <li>Consider adding input validation for edge cases</li>
                              <li>The algorithm efficiency is optimal for this problem</li>
                              <li>Good use of standard library functions</li>
                              <li>Code readability is excellent</li>
                            </ul>
                            <p className="text-white text-sm mt-3">
                              Overall score: <span className="text-green-400 font-semibold">8.5/10</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default ProblemPage;