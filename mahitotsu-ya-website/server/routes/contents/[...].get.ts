import markdownIt from 'markdown-it';
import { fetchWebContent } from "~/utils/fetchWebContent";
import { streamToString } from '~/utils/streamToString';

const renderer = new markdownIt();
export default defineEventHandler(async event => {
    return fetchWebContent(event.path)
        .then(stream => streamToString(stream))
        .then(src => src ? renderer.render(src) : '')
        .then(html => send(event, html, 'text/html'))
        .catch(e => { throw createError({ statusCode: 404 }) });
})