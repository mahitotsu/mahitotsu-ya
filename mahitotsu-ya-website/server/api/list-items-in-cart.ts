import { CartItem, devStorage } from "~/utils/devStorage";

interface RequestParams {
    sessionId: string;
}

export default defineEventHandler(async event => {
    const { sessionId } = getQuery<RequestParams>(event);
    const items = devStorage.get<CartItem[]>(sessionId);
    return items;
})