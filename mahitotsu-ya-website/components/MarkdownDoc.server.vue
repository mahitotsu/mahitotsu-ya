<script setup lang="ts">
const props = defineProps<{
    path: string;
}>();
const { data: html } = await useFetch(['/contents', props.path].join(''));
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