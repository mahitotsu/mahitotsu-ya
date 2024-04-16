import fs from 'fs';
import mime from 'mime';

export default defineEventHandler((event) => {

    const f = `./public${event.path}`;
    if (!fs.existsSync(f)) {
        throw createError({
            statusCode: 404,
        });
    }

    const mimeType = mime.getType(f);
    if (mimeType) {
        event.node.res.setHeader('Content-Type', mimeType);
    }
    return sendStream(event, fs.createReadStream(f));
})