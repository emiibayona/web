<template>
    <div>
        <DecorationUpperBar class="mb-4" :logo="NAVIGATION.MAGIC.logo" :game="NAVIGATION.MAGIC.value" />
        <div v-if="loading" class="w-full mt-10">
            <Loader />
        </div>
        <Empty v-if="!sealed?.rows.length && !loading"
            title="No tenemos sellados por el momento, pronto estaremos con más novedades!!!">
            <Underdev only-contact />
        </Empty>
        <div v-else class="grid grid-cols-1 nm:grid-cols-3  gap-10">
            <Sealed v-for="(value, index) in sealed?.rows" class="" :key="index" :value="value" zoomeable />
        </div>
    </div>
</template>

<script setup>
import Empty from '@/components/atomic/Empty.vue';
import DecorationUpperBar from '@/components/DecorationUpperBar.vue';
import Sealed from '@/components/shop/Sealed.vue';
import useShop from '@/composables/useShop';
import { GAMES, NAVIGATION } from '@/utils/constants';
import { onMounted } from 'vue';

const { sealed, fetchSealedProducts, loading } = useShop(GAMES.MAGIC);

onMounted(async () => {
    await fetchSealedProducts();
});
</script>

<style lang="scss" scoped></style>