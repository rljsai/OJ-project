import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runcode = async (req, res) => {
  const { code, language, testcases } = req.body;

  if (!code || !language || !testcases || !Array.isArray(testcases)) {
    return res.status(400).json({
      success: false,
      message: "code, language and testcases[] are required",
    });
  }

  if (language !== 'cpp') {
    return res.status(400).json({
      success: false,
      message: "Only C++ is currently supported",
    });
  }

  const results = [];
  const selectedTestcases = testcases.slice(0, 2);

  for (const test of selectedTestcases) {
    const jobId = uuidv4();
    const codePath = path.join(__dirname, 'codes', `${jobId}.cpp`);
    const inputPath = path.join(__dirname, 'userInputs', `${jobId}.in`);
    const executablePath = path.join(__dirname, 'executables', `${jobId}.out`);

    // Ensure directories exist
    [codePath, inputPath, executablePath].forEach(p => {
      fs.mkdirSync(path.dirname(p), { recursive: true });
    });

    // Write code and input files
    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, test.input);

    const cleanUp = () => {
      [codePath, inputPath, executablePath].forEach(f => {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      });
    };

    // Compile code
    const compileCommand = `g++ "${codePath}" -o "${executablePath}"`;

    try {
      await new Promise((resolve, reject) => {
        exec(compileCommand, (err, _, stderr) => {
          if (err) {
            cleanUp();
            reject({
              error: "Compilation Error",
              message: stderr || err.message
            });
          } else {
            resolve();
          }
        });
      });

      // Run the compiled program with input
      const execCommand = `"${executablePath}" < "${inputPath}"`;

      const output = await new Promise((resolve, reject) => {
        exec(execCommand, { timeout: 3000 }, (err, stdout, stderr) => {
          cleanUp();

          if (err) {
            if (err.killed && err.signal === "SIGTERM") {
              reject({ error: "Time Limit Exceeded", message: "" });
            } else {
              reject({ error: "Runtime Error", message: stderr || err.message });
            }
          } else {
            resolve(stdout);
          }
        });
      });

      const actualOutput = output?.trim() || "";
      const expectedOutput = test.expectedOutput.trim();

      results.push({
        passed: actualOutput === expectedOutput,
        actualOutput,
        expectedOutput,
        status: "Successful"
      });

    } catch (err) {
      results.push({
        passed: false,
        actualOutput: "",
        expectedOutput: test.expectedOutput.trim(),
        status: err.error,
        message: err.message
      });
    }
  }

  return res.status(200).json({
    success: true,
    results
  });
};
