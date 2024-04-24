import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { Cart, CartItem } from "~/utils/sessionTableTypes";

interface RequestParams {
    sessionId: string;
    item: CartItem;
}

const sessionTableName = useRuntimeConfig().session_table_name;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const type = 'Cart';

export default defineEventHandler(async event => {
    const { sessionId, item } = await readBody<RequestParams>(event);

    const getCommand = new GetCommand({
        TableName: sessionTableName,
        Key: { id: sessionId, type },
    });
    let cart = (await docClient.send(getCommand)).Item as Cart;
    const key = `CIK-${Date.now().toString()}`;

    if (!cart) {
        cart = { id: sessionId, type, goods: {} };
        cart.goods[key] = { ...item, key };
        const insertCommand = new PutCommand({
            TableName: sessionTableName,
            Item: cart,
        });
        return docClient.send(insertCommand).then(result => true);
    } else {
        const updateCommand = new UpdateCommand({
            TableName: sessionTableName,
            Key: { id: sessionId, type },
            UpdateExpression: 'SET goods.#itemKey = :item',
            ExpressionAttributeNames: {
                '#itemKey': key
            },
            ExpressionAttributeValues: {
                ':item': { ...item, key },
            }
        });
        return await docClient.send(updateCommand).then(result => true);
    }
})