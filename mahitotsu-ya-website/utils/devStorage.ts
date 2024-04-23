const store = {} as Record<string, any>

export interface CartItem {
    id: string;
    giftId: string,
    count: number;
}

export interface OrderDescription {
    id: string,
    orderedAt: number,
}

export const devStorage = {
    set: (id: string, value: any) => {
        store[id] = value;
    },
    get: <T>(id: string) => {
        return store[id] as T
    },
};