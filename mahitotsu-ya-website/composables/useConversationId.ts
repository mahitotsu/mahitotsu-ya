export const useConversationId = () => {
    return useState('conversationId', () => `CNV-${Date.now().toString()}`);
}