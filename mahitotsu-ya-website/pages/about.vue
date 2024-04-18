<script setup>
const links = [
    { label: 'Greeting', to: '/about/greeting',  icon: 'i-heroicons-chat-bubble-oval-left-ellipsis', },
    { label: 'Profile', to: '/about/profile',  icon: 'i-heroicons-user', },
    { label: 'History', to: '/about/history', icon: 'i-heroicons-book-open', },
];
</script>

<template>
    <div class="flex">
        <div class="flex-none w-48">
            <UVerticalNavigation :links="links"></UVerticalNavigation>
        </div>
        <div class="flex-1 w-full">
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>