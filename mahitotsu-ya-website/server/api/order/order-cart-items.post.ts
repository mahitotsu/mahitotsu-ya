import { OrderDescription, devStorage } from "~/utils/devStorage";

const orderTable = 'OrderTable';
export default defineEventHandler(async event => {
    const id = `ORD-${Math.floor(Math.random() * 10000)}`;
    const order = {
        id,
        orderedAt: Date.now(),
    } as OrderDescription;

    let orders = devStorage.get<OrderDescription[]>(orderTable);
    if (!orders) {
        orders = [];
    }

    devStorage.set(orderTable, orders.concat(order));
    return id;
})