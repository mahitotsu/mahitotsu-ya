<script setup lang="ts">
const props = defineProps<{
    name: string;
}>();

const { data: html } = await useFetch(`/_content/${props.name}`, {
    lazy: true,
});
</script>

<template>
    <span v-html="html"></span>
</template>