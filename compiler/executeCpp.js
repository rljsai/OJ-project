import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname);



export const executeCpp = async (code, input) => {
    return new Promise((resolve, reject) => {
        const jobId = uuidv4();

        const codepath = path.join(basePath, "codes", `${jobId}.cpp`);
        const inputpath = path.join(basePath, "inputs", `${jobId}.in`);
        const outputpath = path.join(basePath, "outputs", `${jobId}.out`);

        [codepath, inputpath, outputpath].forEach((p) =>
            fs.mkdirSync(path.dirname(p), { recursive: true })
        );

        fs.writeFileSync(codepath, code);
        fs.writeFileSync(inputpath, input);

        const cleanUp = () => {
            [codepath, inputpath, outputpath].forEach((file) => {
                if (fs.existsSync(file)) fs.unlinkSync(file);
            });
        };

        const compileCommand = `g++ "${codepath}" -o "${outputpath}"`;

        exec(compileCommand, (error, stdout, stderr) => {
            if (error) {
                cleanUp();
                reject({ error: "Compilation failed", stderr: stderr || error.message });
            }

            const runCommand = `"${outputpath}" < "${inputpath}"`;
            exec(runCommand, { timeout: 3000 }, (err2, stdout, stderr2) => {
                cleanUp();

                if (err2) {
                    if (err2.killed && err2.signal === "SIGTERM") {
                        return reject({ error: "Time Limit Exceeded", message: "" });
                    }

                    return reject({ error: "Runtime Error", message: stderr2 || err2.message });
                }
                resolve({ status: "Successful", output: stdout.trim() });
            });
        });




    });



}