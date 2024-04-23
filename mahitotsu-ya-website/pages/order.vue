<script setup>
const links = [
    { label: 'お買い物かご', to: '/order/cart', icon: 'i-heroicons-shopping-cart', },
    { label: 'ご注文確認', to: '/order/inquiry', icon: 'i-heroicons-magnifying-glass', },
];
</script>

<template>
    <div class="flex">
        <div class="flex-none w-48">
            <UVerticalNavigation :links="links" :ui="{
                padding:'pt-2 pb-4'
            }"></UVerticalNavigation>
        </div>
        <div class="flex-1 w-full pl-4">
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>