<script setup lang="ts">
import markdownIt from 'markdown-it';
const props = defineProps<{
    path: string;
}>();
const md = markdownIt();
const { data: html } = await useAsyncData(() =>
    fetchWebContent(['/contents', props.path, '.md'].join(''))
        .then(stream => new Promise<string>((resolve, reject) => {
            const chunks = [] as Buffer[];
            stream.on('data', (data) => chunks.push(Buffer.from(data)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        }))
        .then(src => md.render(src)));
</script>

<template>
    <span v-html="html"></span>
</template>

<style scoped>
::v-deep(h1) {
    @apply pb-8 text-xl
}

::v-deep(p) {
    @apply pb-4
}

::v-deep(table) {
    @apply table-auto
}

::v-deep(table td) {
    @apply px-4 py-2 border-b
}
</style>