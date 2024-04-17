export default defineEventHandler(async (event) => {
    return fetch(`http://webcontents${event.path}`)
        .then(res => Promise.all([Promise.resolve(res.headers.get('Content-Type')), res.arrayBuffer()]))
        .then(([contentType, arrayBuffer]) => send(event, Buffer.from(arrayBuffer), contentType ? contentType : undefined))
        .catch(() => { throw createError({ statusCode: 404 }); });
})