import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// const modelId = 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1:200k';
const modelId = 'anthropic.claude-v2';
const client = new BedrockRuntimeClient({
    region: 'us-east-1',
});

interface RequestParams {
    sessionId: string;
    question: string;
}

export default defineEventHandler(async (event): Promise<string> => {

    const { sessionId, question } = await readBody<RequestParams>(event);
    const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        body: JSON.stringify({
            prompt: `Human: あなたは店舗の店頭スタッフです。来店客からの質問または要望に答えてください。
            <question>
            ${question}
            </question>

            Assistant:
            `,
            max_tokens_to_sample: 500,
        }),
    });

    return await client.send(command).then(response => JSON.parse(response.body.transformToString())['completion']);
})