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

    const path = event.apiPath;
    const method = event.httpMethod;
    const queryMap = toMap(event.parameters);
    const bodyMap = toMap(event.requestBody.content['application/json'].properties);

    return {
        'messageVersion': '1.0',
        'response': {
            actionGroup: event['actionGroup'],
            apiPath: event['apiPath'],
            httpMethod: event['httpMethod'],
            httpStatusCode: 200,
            responseBody: {
                'application/json': {
                    body: await fetch(`${baseUrl}${path}?${new URLSearchParams(queryMap)}`, {
                        method,
                        body: JSON.stringify(bodyMap),
                    }).then(res => res.json()),
                }
            }
        },
        sessionAttributes: event['sessionAttributes'],
        promptSessionAttributes: event['promptSessionAttributes']
    }
}