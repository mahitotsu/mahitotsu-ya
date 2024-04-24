import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// const modelId = 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1:200k';
const modelId = 'anthropic.claude-3-haiku-20240307-v1:0';
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
        accept: 'application/json',
        body: JSON.stringify({
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: 500,
            messages: [{
                role: 'user',
                content: [{
                    'type': 'text',
                    'text': `Human: あなたは店舗の店頭スタッフです。来店客からの質問または要望に答えてください。
                            <question>
                            ${question}
                            </question>

                            Assistant:
                            `,
                }]
            }],
        }),
    });

    return await client.send(command).then(response => {
        return JSON.parse(response.body.transformToString())['content'][0]['text'];
    });
})