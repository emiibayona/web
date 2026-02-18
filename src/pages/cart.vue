<template>
    <ProductListsCarts :values="allGamesCarts" />
</template>

<script setup>
import useCarts from '@/composables/useCart';
import ProductListsCarts from '@/components/shop/ProductListsCarts.vue';
const { allGamesCarts } = useCarts();

</script>

<style lang="scss" scoped></style>