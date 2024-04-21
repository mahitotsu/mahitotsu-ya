<script setup lang="ts">
import markdownIt from 'markdown-it';
const props = defineProps<{
    path: string;
}>();
const md = markdownIt();
const { data: html, pending } = useAsyncData(() =>
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
    @apply pb-3 pt-6 text-xl
}

::v-deep(h3) {
    @apply pb-1 pt-3 text-lg font-bold
}

::v-deep(h6) {
    @apply pb-1 pt-1 text-sm 
}

::v-deep(h4) {
    @apply pb-1 pt-2 text-base font-bold
}

::v-deep(p) {
    @apply pb-4
}

::v-deep(ol) {
    @apply list-decimal
}

::v-deep(table) {
    @apply table-auto py-1
}

::v-deep(table td) {
    @apply px-4 py-2 border-b
}
</style>