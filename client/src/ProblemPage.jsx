import { Fragment, useState, useEffect } from "react";
import { FiMaximize2, FiMinimize2, FiCopy, FiAlignLeft, FiPlay, FiCheck, FiX, FiClock, FiCpu, FiDatabase, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiUpload, FiTerminal } from "react-icons/fi";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import logo from "./components/logo.png";
import "./index.css";
import codeicon from "./components/code-icon.png";
import profile from "./components/profile.jpg";

const MaximizeButton = ({ isMaximized, onClick }) => (
  <button
    onClick={onClick}
    className={`ml-2 p-1 rounded transition-colors ${isMaximized ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] hover:bg-[#A020F0] text-white'}`}
    title={isMaximized ? "Exit Maximize" : "Maximize"}
  >
    {isMaximized ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
  </button>
);

const TestCase = ({ testCase, index, isPassed, isRunning, onRun }) => (
  <div className={`p-3 rounded-lg border ${isPassed === true ? 'border-green-500 bg-green-900/20' : isPassed === false ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-[#2a2a3a]'}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-300">Test Case {index + 1}</span>
      <div className="flex items-center space-x-2">
        {isRunning && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A020F0]"></div>}
        {isPassed === true && <FiCheck className="text-green-400" size={16} />}
        {isPassed === false && <FiX className="text-red-400" size={16} />}
        <button
          onClick={() => onRun(index)}
          disabled={isRunning}
          className="bg-[#292A40] hover:bg-[#3a3a55] p-1 rounded text-white disabled:opacity-50"
        >
          <FiPlay size={12} />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <span className="text-gray-400">Input:</span>
        <div className="bg-[#1a1a2a] p-2 rounded mt-1 font-mono">
          {testCase.input}
        </div>
      </div>
      <div>
        <span className="text-gray-400">Expected Output:</span>
        <div className="bg-[#1a1a2a] p-2 rounded mt-1 font-mono">
          {testCase.expectedOutput}
        </div>
      </div>
    </div>
    {testCase.actualOutput && (
      <div className="mt-2">
        <span className="text-gray-400 text-xs">Actual Output:</span>
        <div className="bg-[#1a1a2a] p-2 rounded mt-1 font-mono text-xs">
          {testCase.actualOutput}
        </div>
      </div>
    )}
  </div>
);

const SubmissionResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="p-4 bg-[#2a2a3a] rounded-lg border border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Submission Result</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          result.status === 'Accepted' ? 'bg-green-900/50 text-green-400' :
          result.status === 'Wrong Answer' ? 'bg-red-900/50 text-red-400' :
          result.status === 'Time Limit Exceeded' ? 'bg-yellow-900/50 text-yellow-400' :
          'bg-gray-900/50 text-gray-400'
        }`}>
          {result.status}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <FiClock className="text-gray-400" size={16} />
          <span className="text-gray-300">{result.executionTime || '0'}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiCpu className="text-gray-400" size={16} />
          <span className="text-gray-300">{result.memoryUsed || '0'}MB</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiDatabase className="text-gray-400" size={16} />
          <span className="text-gray-300">{result.testCasesPassed || '0'}/{result.totalTestCases || '0'}</span>
        </div>
      </div>
      
      {result.error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded">
          <span className="text-red-400 text-sm">{result.error}</span>
        </div>
      )}
    </div>
  );
};

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
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState([
    {
      input: "5\n1 2 3 4 5",
      expectedOutput: "15",
      actualOutput: null,
      isRunning: false
    },
    {
      input: "3\n10 20 30",
      expectedOutput: "60",
      actualOutput: null,
      isRunning: false
    },
    {
      input: "0",
      expectedOutput: "0",
      actualOutput: null,
      isRunning: false
    }
  ]);
  const [customTestCases, setCustomTestCases] = useState([]);
  const [newCustomInput, setNewCustomInput] = useState("");
  const [newCustomExpected, setNewCustomExpected] = useState("");
  const [testingTab, setTestingTab] = useState('run');
  const [showSample, setShowSample] = useState(false);
  const [editingCustomIndex, setEditingCustomIndex] = useState(null);
  const [editCustomInput, setEditCustomInput] = useState("");
  const [editCustomExpected, setEditCustomExpected] = useState("");
  const [testingMaximized, setTestingMaximized] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [runResults, setRunResults] = useState([]);
  const [customInputValue, setCustomInputValue] = useState('');
  const [customVerdict, setCustomVerdict] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [testingExpanded, setTestingExpanded] = useState(false);

  const sampleTestCases = [
    { input: '5\n1 2 3 4 5', expected: '15' },
    { input: '3\n10 20 30', expected: '60' }
  ];

  useEffect(() => {
    setCode(getTemplateCode(selectedLanguage));
  }, [selectedLanguage]);

  useEffect(() => {
    if (
      (testingTab === 'run' && runResults.length > 0) ||
      (testingTab === 'custom' && customVerdict) ||
      (testingTab === 'submit' && submitResult)
    ) {
      setTestingExpanded(true);
    } else {
      setTestingExpanded(false);
    }
  }, [testingTab, runResults, customVerdict, submitResult]);

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

  const handleRunCodeWithVerdicts = () => {
    setIsRunning(true);
    setTestingTab('run');
    setTimeout(() => {
      const results = sampleTestCases.map((tc, idx) => ({
        input: tc.input,
        expected: tc.expected,
        output: tc.expected,
        verdict: 'Accepted',
      }));
      setRunResults(results);
      setIsRunning(false);
    }, 1000);
  };

  const handleRunCustomInput = () => {
    setIsRunning(true);
    setCustomVerdict(null);
    setTimeout(() => {
      try {
        const lines = customInputValue.trim().split('\n');
        const n = parseInt(lines[0]);
        const arr = lines[1].split(' ').map(Number);
        if (arr.length !== n) throw new Error('Input length mismatch');
        const sum = arr.reduce((a, b) => a + b, 0);
        setCustomVerdict({
          output: sum.toString(),
          verdict: 'Accepted',
        });
      } catch (e) {
        setCustomVerdict({
          output: 'Error parsing input',
          verdict: 'Error',
        });
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmitWithVerdict = () => {
    setIsSubmitting(true);
    setTestingTab('submit');
    setTimeout(() => {
      setSubmitResult({
        verdict: 'Accepted',
        passed: 2,
        total: 2,
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const handleRunTestCase = async (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index].isRunning = true;
    setTestCases(updatedTestCases);

    setTimeout(() => {
      const newTestCases = [...testCases];
      newTestCases[index].isRunning = false;
      newTestCases[index].actualOutput = "15";
      newTestCases[index].passed = newTestCases[index].actualOutput === newTestCases[index].expectedOutput;
      setTestCases(newTestCases);
    }, 1500);
  };

  const handleAddCustomTestCase = () => {
    if (newCustomInput.trim() && newCustomExpected.trim()) {
      setCustomTestCases([
        ...customTestCases,
        {
          input: newCustomInput,
          expectedOutput: newCustomExpected,
          actualOutput: null,
          isRunning: false,
        },
      ]);
      setNewCustomInput("");
      setNewCustomExpected("");
    }
  };

  const handleRunAll = () => {
    const allCases = [...testCases, ...customTestCases];
    const runningCases = allCases.map(tc => ({ ...tc, isRunning: true }));
    setTestCases(runningCases.slice(0, testCases.length));
    setCustomTestCases(runningCases.slice(testCases.length));
    setTimeout(() => {
      const updated = allCases.map((tc, idx) => {
        const simulated = idx === 0 ? "15" : idx === 1 ? "60" : idx === 2 ? "0" : tc.expectedOutput;
        return {
          ...tc,
          isRunning: false,
          actualOutput: simulated,
          passed: simulated === tc.expectedOutput,
        };
      });
      setTestCases(updated.slice(0, testCases.length));
      setCustomTestCases(updated.slice(testCases.length));
    }, 2000);
  };

  const handleEditCustom = (idx) => {
    setEditingCustomIndex(idx);
    setEditCustomInput(customTestCases[idx].input);
    setEditCustomExpected(customTestCases[idx].expectedOutput);
  };

  const handleSaveEditCustom = (idx) => {
    const updated = [...customTestCases];
    updated[idx].input = editCustomInput;
    updated[idx].expectedOutput = editCustomExpected;
    setCustomTestCases(updated);
    setEditingCustomIndex(null);
    setEditCustomInput("");
    setEditCustomExpected("");
  };

  const handleDeleteCustom = (idx) => {
    setCustomTestCases(customTestCases.filter((_, i) => i !== idx));
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
                <span className="ml-1">Editorial</span>
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
                <span className="ml-1">Editorial</span>
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
            <div className="w-full px-4 pb-4" style={{ boxSizing: 'border-box' }}>
              <div
                className="bg-[#232336] rounded-b-lg shadow-lg border border-[#3a3a55] transition-all duration-300 overflow-hidden"
                style={{
                  minHeight: '48px',
                  height: testingExpanded ? 'auto' : '48px',
                  maxHeight: testingExpanded ? '50vh' : '48px',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
                }}
              >
                <div className="flex items-center justify-between px-4 py-2" style={{ minHeight: '48px' }}>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`flex items-center px-3 py-1 rounded font-semibold text-sm ${testingTab === 'custom' ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] text-white hover:bg-[#8a1fd0]'}`}
                      onClick={() => { setTestingTab('custom'); setCustomVerdict(null); }}
                      style={{ height: '36px' }}
                    >
                      Custom Input
                    </button>
                    <button
                      onClick={handleRunCodeWithVerdicts}
                      disabled={isRunning}
                      className={`flex items-center px-3 py-1 rounded font-semibold text-sm ${testingTab === 'run' ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] text-white hover:bg-[#8a1fd0]'} disabled:opacity-50`}
                      style={{ height: '36px' }}
                    >
                      <FiPlay className="mr-2" size={16} />
                      {isRunning && testingTab === 'run' ? 'Running...' : 'Run'}
                    </button>
                    <button
                      onClick={handleSubmitWithVerdict}
                      disabled={isSubmitting}
                      className={`flex items-center px-3 py-1 rounded font-semibold text-sm ${testingTab === 'submit' ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] text-white hover:bg-[#8a1fd0]'} disabled:opacity-50`}
                      style={{ height: '36px' }}
                    >
                      <FiUpload className="mr-2" size={16} />
                      {isSubmitting && testingTab === 'submit' ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                  <div className="font-semibold text-white text-xs">
                    {testingTab === 'submit' && submitResult && (
                      <>
                        {submitResult.verdict} | Passed {submitResult.passed} / {submitResult.total}
                      </>
                    )}
                  </div>
                  <button
                    className={`ml-2 p-1 rounded bg-[#A020F0] text-white hover:bg-[#8a1fd0] transition-colors flex items-center justify-center`}
                    title={testingMaximized ? 'Minimize' : 'Maximize'}
                    onClick={() => setTestingMaximized(v => !v)}
                    style={{ height: '36px', width: '36px' }}
                  >
                    {testingMaximized ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                  </button>
                </div>
                <div className="px-4 pb-4 flex-1 overflow-y-auto" style={{ minHeight: testingExpanded ? '120px' : '0px' }}>
                  {testingTab === 'run' && (
                    <>
                      <div className="mb-2 text-white font-semibold text-xs">Test Case Results:</div>
                      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 250 }}>
                        {runResults.map((res, idx) => (
                          <div key={idx} className={`rounded border p-2 ${res.verdict === 'Accepted' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`} style={{ fontSize: '12px' }}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-xs text-gray-200">Test Case {idx + 1}</span>
                              <span className={`text-xs font-bold ${res.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{res.verdict}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Input:</div>
                            <div className="text-xs font-mono text-white bg-[#1a1a2a] rounded p-1 mb-1">{res.input}</div>
                            {res.expected && (
                              <>
                                <div className="text-xs text-gray-400">Expected Output:</div>
                                <div className="text-xs font-mono text-white bg-[#1a1a2a] rounded p-1 mb-1">{res.expected}</div>
                              </>
                            )}
                            <div className="text-xs text-gray-400">Your Output:</div>
                            <div className="text-xs font-mono text-white bg-[#1a1a2a] rounded p-1">{res.output}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {testingTab === 'custom' && (
                    <div className="flex-1 h-full flex flex-col min-h-0">
                      {!customVerdict ? (
                        <div className="flex-1 h-full flex flex-col min-h-0">
                          <textarea
                            value={customInputValue}
                            onChange={(e) => setCustomInputValue(e.target.value)}
                            placeholder="Enter your custom input here..."
                            className="w-full bg-[#1a1a2a] border border-gray-600 rounded p-3 text-white text-sm font-mono resize-vertical focus:outline-none focus:border-[#A020F0]"
                            style={{ marginBottom: '16px', height: '120px' }}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleRunCustomInput}
                              disabled={isRunning || !customInputValue.trim()}
                              className="flex items-center bg-[#A020F0] hover:bg-[#8a1fd0] text-white px-4 py-2 rounded disabled:opacity-50"
                              style={{ height: '36px' }}
                            >
                              <FiPlay size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="mb-2 text-white font-semibold text-xs">Custom Input Result:</div>
                          <div className={`rounded border p-4 ${customVerdict.verdict === 'Accepted' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`} style={{ fontSize: '14px', maxHeight: 400, overflowY: 'auto' }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm text-gray-200">Custom Input</span>
                              <span className={`text-sm font-bold ${customVerdict.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{customVerdict.verdict}</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-1">Input:</div>
                            <div className="text-sm font-mono text-white bg-[#1a1a2a] rounded p-2 mb-2 w-full min-h-0 overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }}>{customInputValue}</div>
                            <div className="text-sm text-gray-400 mb-1">Your Output:</div>
                            <div className="text-sm font-mono text-white bg-[#1a1a2a] rounded p-2 mb-3 w-full min-h-0 overflow-y-auto">{customVerdict.output}</div>
                            <button
                              onClick={() => setCustomVerdict(null)}
                              className="text-sm px-3 py-2 rounded bg-[#A020F0] text-white hover:bg-[#8a1fd0]"
                              style={{ height: '36px' }}
                            >
                              Edit Input
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {testingTab === 'submit' && submitResult && (
                    <div className="flex flex-col items-center justify-center" style={{ minHeight: '120px' }}>
                      <div className={`rounded border p-4 w-full max-w-md ${submitResult.verdict === 'Accepted' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-200">Submission Verdict</span>
                          <span className={`text-sm font-bold ${submitResult.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{submitResult.verdict}</span>
                        </div>
                        <div className="text-sm text-gray-300">Passed {submitResult.passed} / {submitResult.total} test cases</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {testingMaximized && (
            <div style={{ height: '100vh', position: 'fixed', top: 0, right: 0, width: '52vw', zIndex: 50, background: '#232336', borderLeft: '1px solid #3a3a55' }}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#3a3a55]" style={{ minHeight: '48px' }}>
                <div className="flex items-center space-x-2">
                  <button
                    className={`flex items-center px-4 py-1 rounded font-semibold text-sm ${testingTab === 'custom' ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] text-white hover:bg-[#8a1fd0]'}`}
                    onClick={() => { setTestingTab('custom'); setCustomVerdict(null); }}
                    style={{ height: '36px' }}
                  >
                    Custom Input
                  </button>
                  <button
                    onClick={handleRunCodeWithVerdicts}
                    disabled={isRunning}
                    className={`flex items-center px-4 py-1 rounded font-semibold text-sm ${testingTab === 'run' ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] text-white hover:bg-[#8a1fd0]'} disabled:opacity-50`}
                    style={{ height: '36px' }}
                  >
                    <FiPlay className="mr-2" size={16} />
                    {isRunning && testingTab === 'run' ? 'Running...' : 'Run'}
                  </button>
                  <button
                    onClick={handleSubmitWithVerdict}
                    disabled={isSubmitting}
                    className={`flex items-center px-4 py-1 rounded font-semibold text-sm ${testingTab === 'submit' ? 'bg-[#A020F0] text-white' : 'bg-[#292A40] text-white hover:bg-[#8a1fd0]'} disabled:opacity-50`}
                    style={{ height: '36px' }}
                  >
                    <FiUpload className="mr-2" size={16} />
                    {isSubmitting && testingTab === 'submit' ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
                <div className="font-semibold text-white text-xs">
                  {testingTab === 'submit' && submitResult && (
                    <>
                      {submitResult.verdict} | Passed {submitResult.passed} / {submitResult.total}
                    </>
                  )}
                </div>
                <button
                  className={`ml-2 p-1 rounded bg-[#A020F0] text-white hover:bg-[#8a1fd0] transition-colors`}
                  title={'Minimize'}
                  onClick={() => setTestingMaximized(false)}
                  style={{ height: '36px', width: '36px' }}
                >
                  <FiMinimize2 size={16} />
                </button>
              </div>
              <div style={{ height: 'calc(100vh - 48px)', overflowY: 'auto', padding: '16px 24px' }}>
                {testingTab === 'run' && (
                  <>
                    <div className="mb-2 text-white font-semibold text-sm">Test Case Results:</div>
                    <div className="space-y-2">
                      {runResults.map((res, idx) => (
                        <div key={idx} className={`rounded border p-2 ${res.verdict === 'Accepted' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-gray-200">Test Case {idx + 1}</span>
                            <span className={`text-xs font-bold ${res.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{res.verdict}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Input:</div>
                          <div className="text-xs font-mono text-white bg-[#1a1a2a] rounded p-1 mb-1">{res.input}</div>
                          {res.expected && (
                            <>
                              <div className="text-xs text-gray-400">Expected Output:</div>
                              <div className="text-xs font-mono text-white bg-[#1a1a2a] rounded p-1 mb-1">{res.expected}</div>
                            </>
                          )}
                          <div className="text-xs text-gray-400">Your Output:</div>
                          <div className="text-xs font-mono text-white bg-[#1a1a2a] rounded p-1">{res.output}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {testingTab === 'custom' && (
                  <div className="flex-1 h-full flex flex-col min-h-0">
                    {!customVerdict ? (
                      <div className="flex-1 h-full flex flex-col min-h-0">
                        <textarea
                          value={customInputValue}
                          onChange={(e) => setCustomInputValue(e.target.value)}
                          placeholder="Enter your custom input here..."
                          className="w-full bg-[#1a1a2a] border border-gray-600 rounded p-3 text-white text-sm font-mono resize-vertical focus:outline-none focus:border-[#A020F0]"
                          style={{ marginBottom: '16px', height: '120px' }}
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleRunCustomInput}
                            disabled={isRunning || !customInputValue.trim()}
                            className="flex items-center bg-[#A020F0] hover:bg-[#8a1fd0] text-white px-4 py-2 rounded disabled:opacity-50"
                            style={{ height: '36px' }}
                          >
                            <FiPlay size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="mb-2 text-white font-semibold text-xs">Custom Input Result:</div>
                        <div className={`rounded border p-4 ${customVerdict.verdict === 'Accepted' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`} style={{ fontSize: '14px', maxHeight: 400, overflowY: 'auto' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-gray-200">Custom Input</span>
                            <span className={`text-sm font-bold ${customVerdict.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{customVerdict.verdict}</span>
                          </div>
                          <div className="text-sm text-gray-400 mb-1">Input:</div>
                          <div className="text-sm font-mono text-white bg-[#1a1a2a] rounded p-2 mb-2 w-full min-h-0 overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }}>{customInputValue}</div>
                          <div className="text-sm text-gray-400 mb-1">Your Output:</div>
                          <div className="text-sm font-mono text-white bg-[#1a1a2a] rounded p-2 mb-3 w-full min-h-0 overflow-y-auto">{customVerdict.output}</div>
                          <button
                            onClick={() => setCustomVerdict(null)}
                            className="text-sm px-3 py-2 rounded bg-[#A020F0] text-white hover:bg-[#8a1fd0]"
                            style={{ height: '36px' }}
                          >
                            Edit Input
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {testingTab === 'submit' && submitResult && (
                  <div className="flex flex-col items-center justify-center" style={{ minHeight: '120px' }}>
                    <div className={`rounded border p-4 w-full max-w-md ${submitResult.verdict === 'Accepted' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-200">Submission Verdict</span>
                        <span className={`text-sm font-bold ${submitResult.verdict === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{submitResult.verdict}</span>
                      </div>
                      <div className="text-sm text-gray-300">Passed {submitResult.passed} / {submitResult.total} test cases</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default ProblemPage;