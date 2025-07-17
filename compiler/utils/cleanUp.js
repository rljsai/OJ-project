import fs from 'fs';

export const cleanUpFiles = async (files) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // minor delay

  for (const filePath of files) {
    let retries = 3;
    while (retries > 0) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          break;
        } else {
          break;
        }
      } catch (err) {
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
  }
};
