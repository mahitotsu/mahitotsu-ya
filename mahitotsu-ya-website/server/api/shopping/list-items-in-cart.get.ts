import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import type { Cart } from "~/utils/sessionTableTypes";

interface RequestParams {
    sessionId: string;
}

const sessionTableName = useRuntimeConfig().session_table_name;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const type = 'Cart';

export default defineEventHandler(async event => {
    const { sessionId } = getQuery<RequestParams>(event);

    const getCommand = new GetCommand({
        TableName: sessionTableName,
        Key: { id: sessionId, type },
    });
    return await docClient.send(getCommand).then(result => result.Item ? Object.values((result.Item as Cart).items) : []);
})