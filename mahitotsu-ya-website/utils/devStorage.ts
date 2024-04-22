const store = {} as Record<string, any>

export interface CartItem {
    id: string;
    count: number;
}

export const devStorage = {
    set: (id: string, value: any) => { 
        store[id] = value;
        console.log(store);
     },
    get: <T>(id: string) => {
        console.log(store);
        return store[id] as T
    },
};