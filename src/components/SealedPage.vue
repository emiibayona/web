<template>
    <div class="min-h-[500px] nm:min-h-screen">
        <DecorationUpperBar class="mb-4" :logo="data?.logo" :game="data?.key" />
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
import Loader from '@/components/atomic/Loader.vue';
import DecorationUpperBar from '@/components/DecorationUpperBar.vue';
import Sealed from '@/components/shop/Sealed.vue';
import useShop from '@/composables/useShop';
import { GAMES, NAVIGATION } from '@/utils/constants';
import { computed, onMounted } from 'vue';

const props = defineProps({ game: { type: String, default: "" } })
const { sealed, fetchSealedProducts, loading } = useShop(props.game);
const data = computed(() => Object.values(NAVIGATION).find(x => x.key === props.game))
onMounted(async () => {
    await fetchSealedProducts();
});
</script>

<style lang="scss" scoped></style>