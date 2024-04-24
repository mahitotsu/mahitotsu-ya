import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

interface RequestParams {
    sessionId: string;
    key: string;
}

const sessionTableName = useRuntimeConfig().session_table_name;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const type = 'Cart';

export default defineEventHandler(async event => {
    const { sessionId, key } = await readBody<RequestParams>(event, { strict: false });

    if (key) {
        const removeCommand = new UpdateCommand({
            TableName: sessionTableName,
            Key: { id: sessionId, type },
            UpdateExpression: 'REMOVE items.#itemKey',
            ExpressionAttributeNames: {
                '#itemKey': key,
            }
        })
        return docClient.send(removeCommand).then(result => true);
    } else {
        const updateCommand = new UpdateCommand({
            TableName: sessionTableName,
            Key: { id: sessionId, type },
            UpdateExpression: 'SET items = :empptyMap',
            ExpressionAttributeValues: {
                ':emptyMap': {}
            }
        });
        return await docClient.send(updateCommand).then(result => true);
    }
})