import morgan from 'morgan';

const logger = morgan('combined');
export default defineEventHandler((event) => {
    logger(event.node.req, event.node.res, () => { });
})