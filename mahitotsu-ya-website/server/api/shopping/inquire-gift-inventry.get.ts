interface RequestParams {
    giftId: string;
}

export default defineEventHandler(async event => {
    const { giftId } = getQuery<RequestParams>(event);
    const seed = Math.random();
    console.log(seed);
    return seed < 0.5;
})