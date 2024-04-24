import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import type { OrderDescription } from '~/utils/sessionTableTypes';

interface RequestParams {
    sessionId: string;
}

const sessionTableName = useRuntimeConfig().session_table_name;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const cartType = 'Cart';
const orderType = 'Order';

export default defineEventHandler(async event => {
    const { sessionId } = await readBody<RequestParams>(event);

    const id = `ORD-${Math.floor(Math.random() * 10000)}`;
    const item = { id, orderedAt: Date.now(), type: orderType } as OrderDescription;

    const txCommand = new TransactWriteCommand({
        TransactItems: [{
            Delete: {
                TableName: sessionTableName,
                Key: { id: sessionId, type: cartType },
            }
        }, {
            Put: {
                TableName: sessionTableName,
                Item: item,
            }
        }]
    });

    return docClient.send(txCommand).then(() => id);
})