import { Fragment, useState, useEffect } from "react";
import { FiMaximize2, FiMinimize2, FiCopy, FiAlignLeft } from "react-icons/fi";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import logo from "./utilities/logo.png"
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

function ProblemPage() {
  const [maximizedPanel, setMaximizedPanel] = useState(null);
  const [code, setCode] = useState(`function hello() {\n  console.log("Hello, world!");\n}`);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  useEffect(() => {
    setCode(getTemplateCode(selectedLanguage));
  }, [selectedLanguage]);

  const handleFormatCode = () => {
    try {
      const formatted = window.prettier.format(code, {
        parser: "babel",
        plugins: [window.prettierPlugins.babel],
        semi: true,
        singleQuote: true,
      });
      if (typeof formatted === "string" && formatted.trim().length > 0) {
        setCode(formatted);
      } else {
        alert("Formatted code is empty or invalid.");
      }
    } catch (err) {
      console.error("Formatting error:", err);
      alert("Error formatting code.");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
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
        extensions={[javascript()]}
        theme="dark"
        onChange={(value) => setCode(value)}
      />
    </div>
  );

  const renderCodeToolbar = (isMaximized) => (
    <div className="absolute top-2 right-2 flex space-x-2 items-center z-20">
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="bg-[#292A40] hover:bg-[#3a3a55] px-2 py-1 rounded text-white text-xs border-none outline-none"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
      </select>
      <button
        onClick={handleFormatCode}
        className="bg-[#292A40] hover:bg-[#3a3a55] p-1 rounded text-white"
        title="Format Code"
      >
        <FiAlignLeft size={16} />
      </button>
      <button
        onClick={handleCopyCode}
        className="bg-[#292A40] hover:bg-[#3a3a55] p-1 rounded text-white"
        title="Copy Code"
      >
        <FiCopy size={16} />
      </button>
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
              <h2 className="text-xl font-bold mb-4 text-white">Sum of Array Elements</h2>
              <p className="mb-4 text-gray-200">Write a function that calculates the sum of all elements in an array.</p>
              <div className="bg-[#1a1a2a] p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-white">Input Format:</h3>
                <p className="text-sm text-gray-200">First line contains an integer N (1 ≤ N ≤ 10^5)</p>
                <p className="text-sm text-gray-200">Second line contains N space-separated integers</p>
              </div>
              <div className="bg-[#1a1a2a] p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-white">Output Format:</h3>
                <p className="text-sm text-gray-200">Print the sum of all elements</p>
              </div>
              <div className="bg-[#1a1a2a] p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">Constraints:</h3>
                <ul className="text-sm list-disc list-inside space-y-1 text-gray-200">
                  <li>1 ≤ N ≤ 10^5</li>
                  <li>-10^9 ≤ array elements ≤ 10^9</li>
                  <li>Time limit: 1 second</li>
                  <li>Memory limit: 256 MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (maximizedPanel === "code") {
    return (
      <div className="w-full h-screen flex flex-col bg-[#1a0f23]">
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
            <div className="flex-1 bg-[#242436] overflow-hidden rounded-b-lg min-h-0">
              <div className="h-full overflow-y-auto p-4 custom-scrollbar" style={{ minHeight: 300 }}>
                {renderCodeEditor()}
              </div>
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
          <button className="bg-[#242436] hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Problems
          </button>
          <img className="w-9 h-9 rounded-full" src={profile} alt="user" />
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
              <h2 className="text-xl font-bold mb-4 text-white">Sum of Array Elements</h2>
              <p className="mb-4 text-gray-200">Write a function that calculates the sum of all elements in an array.</p>
              <div className="bg-[#1a1a2a] p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-white">Input Format:</h3>
                <p className="text-sm text-gray-200">First line contains an integer N (1 ≤ N ≤ 10^5)</p>
                <p className="text-sm text-gray-200">Second line contains N space-separated integers</p>
              </div>
              <div className="bg-[#1a1a2a] p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2 text-white">Output Format:</h3>
                <p className="text-sm text-gray-200">Print the sum of all elements</p>
              </div>
              <div className="bg-[#1a1a2a] p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">Constraints:</h3>
                <ul className="text-sm list-disc list-inside space-y-1 text-gray-200">
                  <li>1 ≤ N ≤ 10^5</li>
                  <li>-10^9 ≤ array elements ≤ 10^9</li>
                  <li>Time limit: 1 second</li>
                  <li>Memory limit: 256 MB</li>
                </ul>
              </div>
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
                <div className="flex-1 bg-[#242436] overflow-hidden rounded-b-lg min-h-0">
                  <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                    {renderCodeEditor()}
                  </div>
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