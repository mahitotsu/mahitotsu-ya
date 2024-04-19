import { ReadStream } from 'fs';

export const streamToString = (stream?: ReadStream) => {
    return stream ? new Promise<string>((resolve, reject) => {
        const chunks = [] as Buffer[];
        stream.on('data', (data) => chunks.push(Buffer.from(data)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    }) :
        undefined;
}