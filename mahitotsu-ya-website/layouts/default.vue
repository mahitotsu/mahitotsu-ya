<script setup lang="ts">
const links = [
    { label: 'まひとつや', to: '/', icon: 'i-heroicons-building-storefront', },
    { label: '取扱商品', to: '/products', icon: 'i-heroicons-gift-top', },
    { label: 'お問い合せ', to: '/help', icon: 'i-heroicons-question-mark-circle', },
    { label: '企業情報', to: '/about', icon: 'i-heroicons-question-mark-circle', },
];
</script>

<template>
    <UContainer>
        <UHorizontalNavigation :links="links" class="border-b border-gray-200"></UHorizontalNavigation>
        <main class="p-4">
            <slot></slot>
        </main>
    </UContainer>
</template>