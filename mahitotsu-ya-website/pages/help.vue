<script setup>
const links = [
    { label: 'お問い合わせ先', to: '/help/contact', icon: 'i-heroicons-phone', },
    { label: 'アクセス方法', to: '/help/route', icon: 'i-heroicons-arrow-trending-down', },
    { label: 'よくある質問', to: '/help/faq', icon: 'i-heroicons-chat-bubble-left-right', },
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