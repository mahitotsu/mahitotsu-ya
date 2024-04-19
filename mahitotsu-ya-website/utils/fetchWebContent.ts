import fs from 'fs';
import path from 'path';

export const fetchWebContent = async (filePath: string) => {
    return fs.createReadStream(path.join('./public', filePath));
}