export const streamToString = async (stream?: ReadableStream) => {
    if (!stream) {
        return undefined;
    }

    const reader = stream.getReader();
    const chunks = [] as Buffer[];
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            if (value) {
                chunks.push(Buffer.from(value));
            }
        }
    } finally {
        reader.releaseLock();
    }
    return Buffer.concat(chunks).toString('utf-8');
}