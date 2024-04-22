<script setup lang="ts">
const sessionId = useState<number>('SessionId', () => Date.now());
const { data: items } = await useFetch('/api/list-items-in-cart', {
    query: { sessionId: sessionId.value }
});
</script>

<template>
    <h1 class="space-b-4">お買い物かご</h1>
    <div>{{ items }}</div>
</template>