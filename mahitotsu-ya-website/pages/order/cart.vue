<script setup lang="ts">
import InfoMessageModal from '~/components/InfoMessageModal.vue';

const modal = useModal();
const sessionId = useConversationId();

const { data: gifts } = await useFetch('/api/product/list-gifts', {
    lazy: true,
    transform: (gifts) => {
        const giftMap = {} as {
            [key: string]: {
                name: string,
                price: number,
            }
        };
        gifts.forEach(gift => {
            giftMap[gift.id] = {
                name: gift.name,
                price: gift.price,
            };
        });
        return giftMap;
    }
});
const { data: goods, refresh } = await useFetch('/api/shopping/list-items-in-cart', {
    lazy: true,
    query: { sessionId: sessionId.value },
    transform: (goods) => goods.map(item => {
        return {
            key: item.key,
            count: item.count,
            name: gifts.value![item.giftId].name,
            price: gifts.value![item.giftId].price,
            total: gifts.value![item.giftId].price * item.count,
        }
    }),
});
const colmuns = [
    { key: 'name', label: '商品名' },
    { key: 'price', label: '単価' },
    { key: 'count', label: '数量' },
    { key: 'total', label: '合計' },
    { key: 'delete', label: '削除' },
];
const formState = computed(() => {
    return {
        sessionId: sessionId.value,
        grandTotal: goods.value ? goods.value.reduce((gt, item) => gt + item.total, 0) : 0,
    }
});
const hasItems = computed(() => goods.value && goods.value.length > 0);
const removeItem = async (key?: string) => {
    await $fetch('/api/shopping/remove-items-from-cart', {
        method: 'POST',
        body: { sessionId: sessionId.value, key },
    }).then(changed => {
        if (changed) refresh();
    });
}
const buyItems = async () => {
    await $fetch('/api/order/order-cart-items', {
        method: 'POST',
        body: { sessionId: sessionId.value },
    }).then(orderId => {
        modal.open(InfoMessageModal, {
            messages: ['お買い上げありがとうございます。ご注文番号をお控えください。', `注文番号: ${orderId}`]
        });
    }).then(() => refresh());
}
</script>

<template>
    <h1 class="mb-4">お買い物かご</h1>
    <div class="grid grid-cols-7 space-x-8">
        <UTable :rows="goods ? goods : []" :columns="colmuns" class="col-span-4">
            <template #price-data="{ row }">
                <div class="text-right">{{ row.price }} 円</div>
            </template>
            <template #count-data="{ row }">
                <div class="text-right">{{ row.count }} 個</div>
            </template>
            <template #total-data="{ row }">
                <div class="text-right">{{ row.total }} 円</div>
            </template>
            <template #delete-data="{ row }">
                <UButton variant="outline" @click="removeItem(row.key)">x</UButton>
            </template>
        </UTable>
        <UForm :state="formState" class="space-y-4 col-span-3">
            <div class="text-xl">総計: <span class="font-bold">{{ formState.grandTotal }}</span> 円</div>
            <div class="flex flex-rows gap-4">
                <UButton type="submit" size="md" icon="i-heroicons-currency-yen" @click="buyItems()"
                    :disabled="!hasItems">
                    商品を購入する</UButton>
                <UButton type="button" size="md" variant="outline" icon="i-heroicons-x-mark" @click="removeItem()"
                    :disabled="!hasItems">買い物かごを空にする</UButton>
            </div>
        </UForm>
    </div>
</template>