<script setup lang="ts">
const links = [
    { label: 'Home', to: '/', icon: 'i-heroicons-building-storefront', },
    { label: 'About', to: '/about/greeting', icon: 'i-heroicons-question-mark-circle', },
];
</script>

<template>
    <div>
        <UHorizontalNavigation :links="links" class="border-b border-gray-200"></UHorizontalNavigation>
        <UContainer>
            <main class="p-4">
                <slot></slot>
            </main>
        </UContainer>
    </div>
</template>