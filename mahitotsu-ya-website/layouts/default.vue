<script setup lang="ts">
const links = [
    { label: 'Home', to: '/', icon: 'i-heroicons-building-storefront', },
    { label: 'About', to: '/about/greeting', icon: 'i-heroicons-question-mark-circle', },
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