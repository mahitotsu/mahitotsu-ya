import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { OrderDescription } from '~/utils/sessionTableTypes';

interface RequestParams {
    orderId: string;
}

const sessionTableName = useRuntimeConfig().session_table_name;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const type = 'Order';

export default defineEventHandler(async event => {

    const { orderId } = getQuery<RequestParams>(event);

    if (orderId) {
        const command = new GetCommand({
            TableName: sessionTableName,
            Key: { id: orderId, type },
        });
        return await docClient.send(command).then(result => result.Item as OrderDescription);
    } else {
        return undefined;
    }
})