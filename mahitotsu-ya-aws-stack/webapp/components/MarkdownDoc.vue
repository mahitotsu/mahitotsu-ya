<script setup lang="ts">
const props = defineProps<{
    path?: string;
}>();
const path = props.path ? props.path : useRouter().currentRoute.value.name!.toString();
const html = await useFetch(`/api/markdowndoc/${path}`, {
    lazy: true,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
}).then(res => res.data);
</script>
<template>
    <span v-html="html"></span>
</template>