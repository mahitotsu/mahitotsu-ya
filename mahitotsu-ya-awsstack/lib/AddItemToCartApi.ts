import { Handler } from "aws-lambda";

const toMap = (kvArray: {
    name: string;
    type: string;
    value: string;
}[]) => {
    return kvArray.reduce((obj, kv) => {
        obj[kv.name] = kv.value;
        return obj;
    }, {} as { [key: string]: string })
}

const baseUrl = process.env.API_BASE_URL;
export const handler: Handler = async (event, context) => {

    const params = toMap(event.parameters);
    const requestBody = {
        sessionId: event.sessionId,
        item: {
            giftId: params.giftId,
            count: Number.parseInt(params.count),
        }
    };

    const responseBody = await fetch(`${baseUrl}api/shopping/add-items-to-cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    }).then(res => res.text());

    const response = {
        messageVersion: '1.0',
        response: {
            actionGroup: event['actionGroup'],
            apiPath: event['apiPath'],
            httpMethod: event['httpMethod'],
            httpStatusCode: 200,
            responseBody: {
                'application/json': {
                    body: responseBody,
                }
            },
        },
        sessionAttributes: event['sessionAttributes'],
        promptSessionAttributes: event['promptSessionAttributes']
    };

    return response
}