import { parse } from 'csv-parse/sync';
import { fetchWebContent } from "~/utils/fetchWebContent";
import { streamToString } from "~/utils/streamToString";

interface RequestParams {
    category: string;
}

interface Product {
    name: string;
    category: string;
    price: number;
    storeOnly: boolean;
    limitedTime: boolean;
    description: string;
    releaseDate: string;
}

export default defineEventHandler(async (event) => {

    const requestParams = getQuery<RequestParams>(event);

    return fetchWebContent('/data/products.csv')
        .then(stream => streamToString(stream))
        .then(data => data ? (parse(data, { columns: true }) as Product[]).filter(product => product.category == requestParams.category) : []);
});