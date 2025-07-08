import { generatefile } from '../generatefile.js';
import { executeCpp } from '../executeCpp.js';

export const runcode = async (req, res) => {
    console.log('Received code execution request');
    console.log('Request body:', req.body);
    
    const { code, language='cpp' } = req.body;
    if(!code){
        console.log('No code provided in request');
        res.status(400).json({success: false, message: "code is required"});
        return;
    }

    try{
        console.log(`Generating file for language: ${language}`);
        const filepath = generatefile(language, code);
        console.log(`File generated at: ${filepath}`);
        
        console.log('Starting C++ execution...');
        const output = await executeCpp(filepath);
        console.log(`Execution completed successfully. Output: ${output}`);
        
        res.status(200).json({success: true, output});
    }catch(error){
        console.error('Error in code execution:', error);
        res.status(500).json({success: false, message: error.message, error: error});
    }
}