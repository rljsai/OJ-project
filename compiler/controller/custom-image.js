import { runCppCode } from '../testcustomcodes/cpprunner.js';
import { runCCode } from '../testcustomcodes/crunner.js';
import { runPythonCode } from '../testcustomcodes/pythonrunner.js';
import { runJavaCode } from '../testcustomcodes/javarunner.js';
import { runJavaScriptCode } from '../testcustomcodes/javascriptrunner.js';
import { runGoCode } from '../testcustomcodes/gorunner.js'; // ✅ Go support


export const customtestcode = async (req, res) => {
  const { code, language, testcase } = req.body;

  if (!code || !language || !testcase) {
    return res.status(400).json({
      success: false,
      message: "code, language and testcases cannot be empty",
    });
  }

  try {
    let result;

    switch (language.toLowerCase()) {
      case 'cpp':
        result = await runCppCode(code, testcase);
        break;
      case 'c':
        result = await runCCode(code, testcase);
        break;
      case 'python':
        result = await runPythonCode(code, testcase);
        break;
      case 'java':
        result = await runJavaCode(code, testcase);
        break;
      case 'javascript':
      case 'js':
        result = await runJavaScriptCode(code, testcase);
        break;
      case 'go':
      case 'golang':
        result = await runGoCode(code, testcase);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported language: ${language}`,
        });
    }

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      success: false,
      errorType: "Internal Error",
      message: err.message || "Unexpected error occurred.",
    });
  }
};

