<template>
    <Ventas :game="GAMES.MAGIC" />
</template>

<script setup>
import Ventas from '@/components/admin/Ventas.vue';
import { GAMES } from '@/utils/constants';
</script>

<style lang="scss" scoped></style>