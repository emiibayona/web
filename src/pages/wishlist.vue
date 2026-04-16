<template>
    <ProductListsCarts v-for="(cart, index) in allGamesWishlists" :cart="cart" :key="`${index}-cart-list`" wishlist/>
</template>

<script setup>
import ProductListsCarts from '@/components/shop/ProductListsCarts.vue';
import useCarts from '@/composables/useCart';
const { allGamesWishlists } = useCarts();

</script>

<style lang="scss" scoped></style>