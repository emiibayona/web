<template>


    <ProductListsCarts v-for="(cart, index) in allGamesCarts" :cart="cart" :key="`${index}-cart-list`" />
    <!-- <ProductListsCarts :cart="allGamesCarts.find(x => x.name === GAMES.MAGIC)" />
    <ProductListsCarts :cart="allGamesCarts.find(x => x.name === GAMES.YUGIOH)" /> -->
</template>

<script setup>
import useCarts from '@/composables/useCart';
import ProductListsCarts from '@/components/shop/ProductListsCarts.vue';
import { GAMES } from '@/utils/constants';
const { allGamesCarts } = useCarts();

</script>

<style lang="scss" scoped></style>