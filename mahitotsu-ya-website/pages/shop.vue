<script setup lang="ts">

const { data: gifts } = useFetch('/api/list-gifts');
</script>

<template>
    <MarkdownDoc path="/shop"></MarkdownDoc>
    <hr class="mt-4 mb-8" />
    <div class="grid grid-cols-2 gap-4">
        <UCard v-for="gift in gifts">
            <template #header>
                <div class="font-bold">{{ gift.name }}</div>
            </template>
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2">{{ gift.description }}</div>
                <div class="col-span-1">
                    <UButton>カートに追加</UButton>
                    <div class="mt-4">
                        <div>内容量: {{ gift.quantity }}</div>
                        <div>価格: {{ gift.price }}</div>
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>