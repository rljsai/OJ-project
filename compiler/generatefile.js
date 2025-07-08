import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

export const generatefile = (language,code) => {
    const jobId = uuid();
    const filename = `${jobId}.${language}`;
    const filepath = path.join(dirCodes,filename);
    fs.writeFileSync(filepath,code);
    return filepath;
};
