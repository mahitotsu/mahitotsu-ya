import { parse } from 'csv-parse/sync';
import { fetchWebContent } from "~/utils/fetchWebContent";
import { streamToString } from "~/utils/streamToString";

export default defineEventHandler(async (event) => {
    return fetchWebContent('/data/products.csv')
        .then(stream => streamToString(stream))
        .then(data => data ? parse(data, { columns: true }) as [] : [])
        .then(records => [... new Set(records.map(record => record['category']))])
        .catch(e => { throw createError({ statusCode: 500 }) })
});