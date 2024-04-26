<script setup lang="ts">
const sessionId = useConversationId();
const model = reactive<{
    question?: string;
    answer?: string;
    processing: boolean;
}>({
    processing: false
});

const askQuestion = async (question?: string) => {
    model.processing = true;
    model.answer = '少々お待ちください ...';
    model.answer = await $fetch('/api/agent/ask-question', {
        method: 'POST',
        body: {
            sessionId: sessionId.value,
            question: question,
        }
    }).then(response => {
        return response;
    }).finally(() => {
        model.processing = false;
    });
}

const clearQuestion = async () => {
    model.question = undefined;
}

const clearAnswer = async () => {
    model.answer = undefined;
    model.processing = false;
}

</script>

<template>
    <h1 class="pb-4 font-bold text-lg">いらっしゃいませ ご来店ありがとうございます。</h1>
    <UForm :state="model" class="flex flex-rows gap-4">
        <div class="mr-8"><img src="/images/mahitotsu-char.jpg" class="w-24 h-24" /></div>
        <div class="space-y-4">
            <p>和菓子をお探しですか。特別な機会のための贈答品のご用意もございます。ご質問やご要望がございましたら、お気軽にお声がけください。</p>
            <UTextarea v-model="model.question" :disabled="model.processing"></UTextarea>
            <div class="flex gap-2">
                <UButton type="button" @click="askQuestion(model.question)" :disabled="model.processing">声をかける
                </UButton>
                <UButton type="button" variant="outline" @click="clearQuestion()" :disabled="model.processing">考えなおす
                </UButton>
            </div>
            <UAlert title="回答" icon="i-heroicons-chat-bubble-left-ellipsis" :description="model.answer" />
            <UButton v-if="model.answer" @click="clearAnswer()" variant="outline">回答を消す</UButton>
        </div>
    </UForm>
</template>