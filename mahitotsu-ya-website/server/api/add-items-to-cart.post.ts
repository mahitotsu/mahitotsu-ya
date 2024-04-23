import { CartItem, devStorage } from "~/utils/devStorage";

interface RequestParams {
    sessionId: string;
    item: CartItem;
}

export default defineEventHandler(async event => {
    const { sessionId, item } = await readBody<RequestParams>(event);
    let items = devStorage.get<CartItem[]>(sessionId);
    if (items == undefined) {
        items = [];
    }
    devStorage.set(sessionId, items.concat({ ...item, id: Date.now().toString() }));
    return true;
})