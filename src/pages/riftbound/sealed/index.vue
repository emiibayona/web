<template>
    <div>
        <div v-if="loading" class="w-full mt-10">
            <Loader />
        </div>
        <Empty v-if="!sealed?.rows.length && !loading" />
        <div v-else class="grid grid-cols-1 nm:grid-cols-3  gap-10">
            <Sealed v-for="(value, index) in sealed?.rows" class="" :key="index" :value="value" />
        </div>
    </div>
</template>

<script setup>
import Sealed from '@/components/shop/Sealed.vue';
import useShop from '@/composables/useShop';
import { GAMES } from '@/utils/constants';
import { onMounted } from 'vue';

const { sealed, fetchSealedProducts, loading } = useShop(GAMES.RIFTBOUND);

onMounted(async () => {
    await fetchSealedProducts();
});
</script>

<style lang="scss" scoped></style>