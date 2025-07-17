// runners/cRunner.js
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { cleanUpFiles } from '../utils/cleanUp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '../');

export const runCCode = async (code, input) => {
  const jobId = uuidv4();

  const codePath = path.join(baseDir, 'codes', `${jobId}.c`);
  const inputPath = path.join(baseDir, 'userInputs', `${jobId}.in`);
  const executablePath = path.join(baseDir, 'executables', `${jobId}.out`);

  [codePath, inputPath, executablePath].forEach(p => {
    fs.mkdirSync(path.dirname(p), { recursive: true });
  });

  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input);

  const compileResult = await new Promise((resolve) => {
    exec(`gcc "${codePath}" -o "${executablePath}"`, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        resolve({
          success: false,
          errorType: "Compilation Error",
          message: stderr || err.message
        });
      } else {
        resolve({ success: true });
      }
    });
  });

  if (!compileResult.success) {
    await cleanUpFiles([codePath, inputPath, executablePath]);
    return compileResult;
  }

  const execResult = await new Promise((resolve) => {
    const child = spawn(executablePath, [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 3000
    });

    let stdout = '';
    let stderr = '';
    let isResolved = false;
    const maxOutputSize = 1024 * 1024;

    child.stdin.write(input);
    child.stdin.end();

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > maxOutputSize && !isResolved) {
        isResolved = true;
        child.kill('SIGTERM');
        setTimeout(() => child.kill('SIGKILL'), 1000);
        resolve({
          success: false,
          errorType: "Output Limit Exceeded",
          message: "Program output exceeded 1MB."
        });
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('exit', async (code, signal) => {
      await cleanUpFiles([codePath, inputPath, executablePath]);

      if (!isResolved) {
        isResolved = true;
        if (signal === 'SIGTERM') {
          resolve({
            success: false,
            errorType: "Time Limit Exceeded",
            message: "Execution time exceeded the limit."
          });
        } else if (code !== 0) {
          resolve({
            success: false,
            errorType: "Runtime Error",
            message: stderr || `Exited with code ${code}`
          });
        } else {
          resolve({
            success: true,
            output: stdout.trim()
          });
        }
      }
    });

    child.on('error', async (err) => {
      await cleanUpFiles([codePath, inputPath, executablePath]);
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          errorType: "Runtime Error",
          message: err.message
        });
      }
    });

    setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        child.kill('SIGKILL');
        resolve({
          success: false,
          errorType: "Time Limit Exceeded",
          message: "Execution timed out."
        });
      }
    }, 3500);
  });

  return execResult;
};
