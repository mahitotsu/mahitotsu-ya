import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

const client = new BedrockAgentRuntimeClient({
    region: 'us-east-1',
});

interface RequestParams {
    sessionId: string;
    question: string;
}

const runtimeConfig = useRuntimeConfig();
const agentId = runtimeConfig.agent_id;
const agentAliasId = runtimeConfig.agent_alias_id;

export default defineEventHandler(async (event): Promise<string | undefined> => {

    const { sessionId, question } = await readBody<RequestParams>(event);
    const command = new InvokeAgentCommand({
        agentId,
        agentAliasId,
        sessionId,
        endSession: false,
        enableTrace: false,
        inputText: question,
        sessionState: {
            promptSessionAttributes: {
                timeZone: 'JST',
                locale: 'ja_JP'
            }
        }
    });

    return await client.send(command).then(async response => {
        if (!response.completion) {
            return undefined;
        }

        const decorder = new TextDecoder('utf-8');
        const answer = [] as string[];
        for await (const stream of response.completion) {
            if (stream.chunk && stream.chunk.bytes) {
                const chunk = decorder.decode(stream.chunk.bytes)
                answer.push(chunk);
            }
        }
        return answer.join('');
    });
})