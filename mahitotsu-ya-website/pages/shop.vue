<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
import ErrorMessageModal from '~/components/ErrorMessageModal.vue';
import InfoMessageModal from '~/components/InfoMessageModal.vue';
import type { CartItem } from '~/utils/sessionTableTypes';

const modal = useModal();
const sessionId = useConversationId();

const { data: gifts } = await useFetch('/api/product/list-gifts', {
    lazy: true,
});
const models = {} as {
    [key: string]: Record<string, any>,
}

const schema = z.object({
    giftId: z.string(),
    count: z.number().min(1, 'ご注文は最低1つから承っております。').max(10, 'ご注文は商品一つにつき最高10個までとさせていただいております。'),
});
type Schema = z.output<typeof schema>;

gifts.value?.forEach(gift => {
    models[gift.id] = reactive({
        giftId: gift.id,
        count: 1,
    });
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const item = { ...event.data } as CartItem;
    const hasStock = await $fetch('/api/shopping/inquire-gift-inventry', {
        query: { giftId: item.giftId },
    });
    if (!hasStock) {
        modal.open(ErrorMessageModal, {
            messages: ['申し訳ございません。現在この商品は品切れとなっております。'],
        })
    } else {
        await $fetch('/api/shopping/add-items-to-cart', {
            method: 'POST',
            body: { sessionId: sessionId.value, item },
        }).then((changed) => {
            if (changed) modal.open(InfoMessageModal, {
                messages: ['お買い物籠に商品を追加しました。']
            })
        });
    }
}

const onError = async (event: FormErrorEvent) => {
    modal.open(ErrorMessageModal, {
        messages: event.errors.map(error => error.message),
    });
}

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
                <div class="col-span-2">
                    <img src="/images/golden-yokan.jpg" class="w-24 h-24" />
                    <div>{{ gift.description }}</div>
                </div>
                <UForm class="col-span-1 space-y-4" :schema="schema" :state="models[gift.id]" @submit="onSubmit"
                    @error="onError">
                    <UFormGroup label="購入個数">
                        <UInput type="number" size="sm" v-model="models[gift.id].count" />
                    </UFormGroup>
                    <UButton type="submit" size="md">お買い物かご に追加</UButton>
                    <div class="mt-4">
                        <div>内容量: {{ gift.quantity }}</div>
                        <div>価格: {{ gift.price }} 円</div>
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>