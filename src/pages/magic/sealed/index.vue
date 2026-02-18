<template>
    <div>
        <div class="grid grid-cols-2 gap-10">
            <Sealed
                v-for="(value, index) in [...(sealed?.rows || []), ...(sealed?.rows || []), ...(sealed?.rows || [])]"
                :key="index" :value="value" />
        </div>
    </div>
</template>

<script setup>
import Sealed from '@/components/shop/Sealed.vue';
import useShop from '@/composables/useShop';
import { GAMES } from '@/utils/constants';
import { onMounted } from 'vue';

const { sealed, fetchSealedProducts } = useShop(GAMES.MAGIC);

onMounted(async () => {
    await fetchSealedProducts();
});
</script>

<style lang="scss" scoped></style>