import fs from 'fs';
import markdown from 'markdown-it';
import path from 'path';

const runtimeConfig = useRuntimeConfig();
const webcontentsBaseUrl = runtimeConfig.webcontentsBaseUrl;
const isDev = (webcontentsBaseUrl === '');
const md = markdown();

export default defineEventHandler(event => {
    const filePath = [event.path, '.md'].join('');
    return (isDev ?
        (fs.promises.readFile(path.join('./public', filePath)))
            .then(text => Promise.resolve(text.toString())) :
        (fetch(path.join(webcontentsBaseUrl, filePath))
            .then(res => res.text())
        ))
        .then(text => send(event, md.render(text), 'text/html'))
        .catch(() => { throw createError({ statusCode: 404 }) });
})