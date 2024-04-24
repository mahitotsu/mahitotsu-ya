import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { OrderDescription } from '~/utils/sessionTableTypes';

const sessionTableName = useRuntimeConfig().session_table_name;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const type = 'Order';

export default defineEventHandler(async event => {

    const id = `ORD-${Math.floor(Math.random() * 10000)}`;
    const item = { id, orderedAt: Date.now(), type } as OrderDescription;

    const command = new PutCommand({
        TableName: sessionTableName,
        Item: item,
    });
    return await docClient.send(command).then(() => id);
})