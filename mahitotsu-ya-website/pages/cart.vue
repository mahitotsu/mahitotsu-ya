<script setup lang="ts">
import ErrorMessageModal from '~/components/ErrorMessageModal.vue';

const modal = useModal();
const sessionId = useState<number>('SessionId', () => Date.now());

const { data: gifts } = await useFetch('/api/list-gifts', {
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
const { data: items, refresh } = await useFetch('/api/list-items-in-cart', {
    query: { sessionId: sessionId.value },
    transform: (items) => items.map(item => {
        return {
            id: item.id,
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
        grandTotal: items.value ? items.value.reduce((gt, item) => gt + item.total, 0) : 0,
    }
});
const hasItems = computed(() => items.value && items.value.length > 0);
const removeItem = async (id?: string) => {
    await $fetch('/api/remove-items-from-cart', {
        method: 'POST',
        body: { sessionId: sessionId.value, id },
    }).then(changed => {
        if (changed) refresh();
    });
}
const buyItems = async () => {
    modal.open(ErrorMessageModal, {
        messages: ['現在、システム障害によりお会計が出来ません。復旧までお待ちいただくようよろしくお願いいたします。'],
    });
}
</script>

<template>
    <h1 class="mb-4">お買い物かご</h1>
    <div class="grid grid-cols-3 space-x-8">
        <UTable :rows="items ? items : []" :columns="colmuns" class="col-span-2">
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
                <UButton variant="outline" @click="removeItem(row.id)">x</UButton>
            </template>
        </UTable>
        <UForm :state="formState" class="space-y-4">
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