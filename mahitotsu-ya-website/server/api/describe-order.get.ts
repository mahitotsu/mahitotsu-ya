import { OrderDescription, devStorage } from "~/utils/devStorage";

interface RequestParams {
    orderId: string;
}

export default defineEventHandler(async event => {
    const { orderId } = getQuery<RequestParams>(event);
    const orders = devStorage.get<OrderDescription[]>('OrderTable');
    const order = orders ? orders.find(order => order.id == orderId) : undefined;
    return { order };
})