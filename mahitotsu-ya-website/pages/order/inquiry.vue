<script setup lang="ts">
import ErrorMessageModal from '~/components/ErrorMessageModal.vue';
import InfoMessageModal from '~/components/InfoMessageModal.vue';

const model = reactive<{
    orderId?: string;
}>({
});

const modal = useModal();
const inquireOrder = async (orderId?:string) => {
    await $fetch('/api/order/describe-order', {
        query: { orderId },
    }).then(result => {
        const order = result.order;
        if (order) {
            modal.open(InfoMessageModal, {
                messages: ['ご注文を承っております。']
            })
        } else {
            modal.open(ErrorMessageModal, {
                messages: ['ご注文は承っていません。']
            })
        }
    });
}

</script>

<template>
    <h1 class="mb-4">ご注文問い合わせ</h1>
    <p class="pt-4 pb-4">ご注文を承っているかどうか、ご確認いただくことができます。</p>
    <UForm class="grid grid-cols-2 gap-4 items-end" :state="model">
        <UFormGroup label="ご注文番号">
            <UInput type="text" size="sm" v-model="model.orderId" placeholder="ORD-xxxx" />
        </UFormGroup>
        <div>
            <UButton type="button" @click="inquireOrder(model.orderId)">確認する</UButton>
        </div>
    </UForm>
</template>