<script setup>
const links = [
    { label: '社長ご挨拶', to: '/about/greeting', icon: 'i-heroicons-chat-bubble-oval-left-ellipsis', },
    { label: '会社概要', to: '/about/profile', icon: 'i-heroicons-user', },
    { label: '沿革・歴史', to: '/about/history', icon: 'i-heroicons-book-open', },
];
</script>

<template>
    <div class="flex">
        <div class="flex-none w-48">
            <UVerticalNavigation :links="links" :ui="{
                padding: 'pt-2 pb-4'
            }"></UVerticalNavigation>
        </div>
        <div class="flex-1 w-full pl-4">
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>