<script setup lang="ts">
import MarkdownIt from 'markdown-it';
const props = defineProps<{
    name: string;
}>();

const md = new MarkdownIt();
const { data } = await useFetch(`http://localhost:3000/_content/${props.name}.md`);
const html = data.value ? await md.render(data.value as string) : "";
</script>

<template>
    <span v-html="html"></span>
</template>