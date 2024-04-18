import fs from 'fs';
import { H3Event } from 'h3';
import mime from 'mime/lite';
import path from 'path';

const runtimeConfig = useRuntimeConfig();
const webcontentsBaseUrl = runtimeConfig.webcontentsBaseUrl;
const isDev = (webcontentsBaseUrl === '');

export const fetchWebContent = (event: H3Event, filePath?: string) => {

    // for dev
    if (isDev) {
        const mimeType = mime.getType(event.path);
        if (mimeType) {
            event.node.res.setHeader('Content-Type', mimeType);
        }
        return sendStream(event, fs.createReadStream(path.join('./public', event.path)))
            .catch(() => { throw createError({ statusCode: 404 }) });
    }

    // for production
    return fetch(path.join(webcontentsBaseUrl, filePath ? filePath : event.path))
        .then(res => Promise.all([Promise.resolve(res.headers.get('Content-Type')), res.arrayBuffer()]))
        .then(([contentType, arrayBuffer]) => send(event, Buffer.from(arrayBuffer), contentType ? contentType : undefined))
        .catch(() => { throw createError({ statusCode: 404 }); });
}