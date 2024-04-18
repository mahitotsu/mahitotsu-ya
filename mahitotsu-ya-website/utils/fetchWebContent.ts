import { H3Event } from 'h3';
import path from 'path';

const runtimeConfig = useRuntimeConfig();
const webcontentsBaseUrl = runtimeConfig.webcontentsBaseUrl as string;

export const fetchWebContent = (event: H3Event, filePath?: string) => {
    return fetch(path.join(webcontentsBaseUrl, filePath ? filePath : event.path))
        .then(res => Promise.all([Promise.resolve(res.headers.get('Content-Type')), res.arrayBuffer()]))
        .then(([contentType, arrayBuffer]) => send(event, Buffer.from(arrayBuffer), contentType ? contentType : undefined))
        .catch(() => { throw createError({ statusCode: 404 }); });
}