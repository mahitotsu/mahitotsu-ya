<script setup lang="ts">
const props = defineProps<{
    messages: string[];
}>();
</script>
<template>
    <UModal>
        <UCard>
            <template #header>
                <UIcon name="i-heroicons-exclamation-triangle" />
            </template>
            <ul class="px-4 space-y-1 list-disc">
                <li v-for="message in props.messages">{{ message }}</li>
            </ul>
        </UCard>
    </UModal>
</template>