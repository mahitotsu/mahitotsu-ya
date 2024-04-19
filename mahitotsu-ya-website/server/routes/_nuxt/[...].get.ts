import mime from 'mime/lite';
import { fetchWebContent } from "~/utils/fetchWebContent";

export default defineEventHandler(async event => {
    return Promise.all([
        Promise.resolve(mime.getType(event.path)),
        fetchWebContent(event.path),
    ])
        .then(([type, stream]) => {
            if (type) event.node.res.setHeader('Content-Type', type);
            return sendStream(event, stream);
        })
        .catch(e => { throw createError({ statusCode: 404 }) });
})