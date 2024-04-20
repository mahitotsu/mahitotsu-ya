import { parse } from 'csv-parse/sync';
import { fetchWebContent } from "~/utils/fetchWebContent";
import { streamToString } from "~/utils/streamToString";

interface Category {
    name: string;
    description: string;
}

export default defineEventHandler(async (event) => {
    return fetchWebContent('/data/categories.csv')
        .then(stream => streamToString(stream))
        .then(data => data ? parse(data, { columns: true }) as Category[] : [])
        .catch(e => { throw createError({ statusCode: 500 }) })
});