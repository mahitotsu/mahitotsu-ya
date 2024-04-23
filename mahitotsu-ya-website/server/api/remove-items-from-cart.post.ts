import { CartItem, devStorage } from "~/utils/devStorage";

interface RequestParams {
    sessionId: string;
    id: string;
}

export default defineEventHandler(async event => {
    const { sessionId, id } = await readBody<RequestParams>(event);
    let items = devStorage.get<CartItem[]>(sessionId);
    if (items == undefined) {
        return false;
    }
    devStorage.set(sessionId, items.filter(item => item.id != id));
    return true;
})