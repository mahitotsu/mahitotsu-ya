<script setup lang="ts">

const { data: categories } = await useFetch('/api/product/list-categories', {
    transform: (categories) => categories.map(category => {
        return {
            label: category.name,
            description: category.description
        };
    }),
});
const selectedIndex = useState<number>('SelectedCategoryIndex', () => 0);
const selectedCategory = computed(() => categories.value ? categories.value[selectedIndex.value].label : undefined);

const { data: products } = await useFetch('/api/product/list-products', {
    lazy: true,
    query: { category: selectedCategory },
    transform: (products) => products.map(product => {
        return {
            ...product,
            badges: (() => {
                const items = [];
                if (product.storeOnly.toString() == 'true') items.push('店舗限定');
                if (product.limitedTime.toString() == 'true') items.push('期間限定');
                return items;
            })()
        }
    })
});

const selectCategory = (index: number) => {
    selectedIndex.value = index;
}
</script>

<template>
    <MarkdownDoc path="/products"></MarkdownDoc>
    <UTabs :items="categories" v-model="selectedIndex" @change="selectCategory" class="w-full">
        <template #item="{ item }">
            <p class="pt-4 pb-4">{{ item.description }}</p>
            <div class="flex flex-wrap gap-4 place-items-stretch">
                <UCard v-for="product in products" class="w-56">
                    <template #header>
                        <div class="h-12">
                            <div class="font-bold pb-2">{{ product.name }}</div>
                            <div v-if="product.badges" class="text-sm">
                                <span class="mr-2 bg-lime-200" v-for="badge in product.badges">{{ badge }}</span>
                            </div>
                        </div>
                    </template>
                    <div>{{ product.description }}</div>
                    <template #footer>
                        <div>価格: {{ product.price }} 円</div>
                    </template>
                </UCard>
            </div>
        </template>
    </UTabs>
</template>