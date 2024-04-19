<script setup lang="ts">
import markdownIt from 'markdown-it';
const props = defineProps<{
    path: string;
}>();
const md = markdownIt();
const { data: html, pending } = await useAsyncData(() =>
    fetchWebContent(['/contents', props.path, '.md'].join(''))
        .then(stream => streamToString(stream))
        .then(src => md.render(src ? src : '')), {
    lazy: true,
});
</script>

<template>
    <span v-if="pending">Loading ...</span>
    <span v-else v-html="html"></span>
</template>

<style scoped>
::v-deep(h1) {
    @apply pb-8 text-xl
}

::v-deep(h2) {
    @apply py-4 text-lg
}

::v-deep(h3) {
    @apply py-4 text-base font-bold
}

::v-deep(p) {
    @apply pb-4
}

::v-deep(ol) {
    @apply list-decimal
}

::v-deep(table) {
    @apply table-auto
}

::v-deep(table td) {
    @apply px-4 py-2 border-b
}
</style>