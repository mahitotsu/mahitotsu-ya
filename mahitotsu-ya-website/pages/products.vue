<script setup lang="ts">
const { data } = await useFetch('/api/list-categories');
const categories = (data.value as string[]).map(category => {
    return {
        label: category,
    };
});
</script>

<template>
    <MarkdownDoc path="/products"></MarkdownDoc>
    <UTabs :items="categories" class="w-full">

    </UTabs>
</template>