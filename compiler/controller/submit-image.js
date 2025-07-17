import problem from '../models/problem.js';
import { runCppCode } from '../testcustomcodes/cpprunner.js';
import { runCCode } from '../testcustomcodes/crunner.js';
import { runPythonCode } from '../testcustomcodes/pythonrunner.js';
import { runJavaCode } from '../testcustomcodes/javarunner.js';
import { runJavaScriptCode } from '../testcustomcodes/javascriptrunner.js';
import { runGoCode } from '../testcustomcodes/gorunner.js';
import submission from '../models/submission.js';
export const submitcode = async (req, res) => {
  const { language, code, questionId } = req.body;

  try {
    const question = await problem.findById(questionId);
    const testcases = question.testcases;
    const results = [];
    let PassedTestcases=0;
    for (const testcase of testcases) {
      let result;

      switch (language.toLowerCase()) {
        case 'cpp':
          result = await runCppCode(code, testcase.input);
          break;
        case 'c':
          result = await runCCode(code, testcase.input); // ✅ fixed
          break;
        case 'python':
          result = await runPythonCode(code, testcase.input);
          break;
        case 'java':
          result = await runJavaCode(code, testcase.input);
          break;
        case 'javascript':
        case 'js':
          result = await runJavaScriptCode(code, testcase.input);
          break;
        case 'go':
        case 'golang':
          result = await runGoCode(code, testcase.input);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: `Unsupported language: ${language}`,
          });
      }

      // Handle Compilation Error early
      if (!result.success && result.errorType === "Compilation Error") {
        return res.status(200).json({
          compileverdict: false,
          message: result.message
        });
      }

      // Build final result structure
      results.push({
        compileverdict: true,
        verdict: result.success && result.output.trim() === testcase.ExpectedOutput.trim()
          ? "Accepted"
          : "Wrong Answer",
        message: result.errorType || null

      });

      if(result.success && result.output.trim() === testcase.ExpectedOutput.trim()){
        PassedTestcases++;
      }
    }
    await submission.create({
        language:language,
        verdict: PassedTestcases === testcases.length ? 'Accepted' : 'Wrong Answer',
        score: (PassedTestcases / testcases.length) * 100,
        code:code,
        username: userId,
        problem: questionId
      });
    return res.status(200).json({
      success: true,
      PassedTestcases:PassedTestcases,
      TotalTestcases:testcases.length,
      results,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      errorType: "Internal Error",
      message: err.message || "Unexpected error occurred.",
    });
  }
};
