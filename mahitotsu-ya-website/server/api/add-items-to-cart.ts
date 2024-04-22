import { CartItem, devStorage } from "~/utils/devStorage";

interface RequestParams {
    sessionId: string;
    item: CartItem;
}

export default defineEventHandler(async event => {
    const {sessionId, item} = await readBody<RequestParams>(event);
    let items = devStorage.get<CartItem[]>(sessionId);
    if (items == undefined) {
        items = [];
    }
    items.push(item);
    devStorage.set(sessionId, items);
    return true;
})