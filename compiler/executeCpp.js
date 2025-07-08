import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname,"outputs");

// Ensure outputs directory exists
if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, { recursive: true });
   
}
 
export const executeCpp = async (filepath) => {
  
    
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath,`${jobId}.exe`);
    

    return new Promise((resolve,reject)=>{
      
        const compileCommand = `g++ "${filepath}" -o "${outPath}"`;
        console.log(`Compilation command: ${compileCommand}`);
        
        exec(compileCommand, (compileError, compileStdout, compileStderr) => {
            console.log(`Compilation completed`);
            console.log(`Compile stdout: ${compileStdout}`);
            console.log(`Compile stderr: ${compileStderr}`);
            console.log(`Compile error: ${compileError}`);
            
            if(compileError){
                console.log(`Compilation failed with error: ${compileError.message}`);
                reject({error: compileError, stderr: compileStderr});
                return;
            }
            
            // Check if executable was created
            if(fs.existsSync(outPath)){
                console.log(`Executable created successfully: ${outPath}`);
            } else {
                console.log(`Executable was NOT created at: ${outPath}`);
                reject({error: new Error('Executable not created'), stderr: compileStderr});
                return;
            }
            
            // Then execute the compiled file
            const execCommand = `"${outPath}"`;
            console.log(`Execution command: ${execCommand}`);
            
            exec(execCommand, (execError, execStdout, execStderr) => {
                console.log(`Execution completed`);
                console.log(`Exec stdout: ${execStdout}`);
                console.log(`Exec stderr: ${execStderr}`);
                console.log(`Exec error: ${execError}`);
                
                if(execError){
                    console.log(`Execution failed with error: ${execError.message}`);
                    reject({error: execError, stderr: execStderr});
                    return;
                }
                
                console.log(`Execution successful, output: ${execStdout}`);
                resolve(execStdout);
            });
        });
    });
}