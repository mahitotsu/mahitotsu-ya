import helmet from 'helmet';

const h = helmet();
export default defineEventHandler((event) => {
    h(event.node.req, event.node.res, () => { });
})