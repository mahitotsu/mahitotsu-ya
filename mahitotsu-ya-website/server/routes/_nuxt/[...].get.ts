import { fetchWebContent } from "~/utils/fetchWebContent";

export default defineEventHandler(async (event) => {
    return fetchWebContent(event);
})