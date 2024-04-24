export interface Cart {
    id: string;
    readonly type: 'Cart';
    goods: { [key: string]: CartItem };
}

export interface CartItem {
    key: string;
    giftId: string;
    count: number;
}

export interface OrderDescription {
    id: string;
    readonly type: 'Order';
    orderedAt: number;
}