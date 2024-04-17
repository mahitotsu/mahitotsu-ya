import fs from 'fs';
import markdown from 'markdown-it';

const m = markdown();
export default defineEventHandler((event) => {

    const f = `./public${event.path}.md`;
    if (!fs.existsSync(f)) {
        throw createError({
            statusCode: 404,
        });
    }

    return fs.promises.readFile(f).then(text => m.render(text.toString())).then(html => send(event, html, 'text/html'));
})