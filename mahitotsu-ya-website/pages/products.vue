<script setup lang="ts">

const { data: categories } = await useFetch('/api/list-categories', {
    transform: (categories) => categories.map(category => {
        return {
            label: category.name,
            description: category.description
        };
    }),
});

const selectedCategory = ref();
const onChangeCategory = (index: number) => {
    selectedCategory.value = (categories.value ? categories.value[index].label : undefined);
}
onChangeCategory(0);

const { data: products } = await useFetch('/api/list-products', {
    query: { category: selectedCategory },
});
</script>

<template>
    <MarkdownDoc path="/products"></MarkdownDoc>
    <UTabs :items="categories" :defaultIndex="0" @change="onChangeCategory" class="w-full">
        <template #item="{ item }">
            <p class="pt-4 pb-4">{{ item.description }}</p>
            <div class="flex flex-wrap gap-4 place-items-stretch">
                <UCard v-for="product in products" class="w-56">
                    <template #header>
                        <div>{{ product.name }}</div>
                    </template>
                    <div class="h-48">{{ product.description }}</div>
                    <template #footer>
                        <div>価格: {{ product.price }} 円</div>
                    </template>
                </UCard>
            </div>
        </template>
    </UTabs>
</template>