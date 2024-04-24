<script setup lang="ts">
const props = defineProps<{
    path: string;
}>();
const { data: html } = useAsyncData(() =>
    $fetch(['/contents', props.path, '.md'].join('')), );
</script>

<template>
    <span v-html="html"></span>
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