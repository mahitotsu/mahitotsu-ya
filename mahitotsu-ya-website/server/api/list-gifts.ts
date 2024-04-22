import { parse } from 'csv-parse/sync';
import { fetchWebContent } from "~/utils/fetchWebContent";
import { streamToString } from "~/utils/streamToString";

interface Gift {
    id: string,
    name: string;
    quantity: string;
    price: number;
    description: string;
}

export default defineEventHandler(async (event) => {
    return fetchWebContent('/data/gifts.csv')
        .then(stream => streamToString(stream))
        .then(data => data ? parse(data, { columns: true }) as Gift[] : []);
});