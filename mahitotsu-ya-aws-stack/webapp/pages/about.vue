<script setup lang="ts">
import markdownit from 'markdown-it';
const md = markdownit();
const html = await useFetch('/_content/about.md').then(response => (response.data.value! as Blob).text()).then(text => md.render(text));
</script>
<template>
    <span v-html="html"></span>
</template>