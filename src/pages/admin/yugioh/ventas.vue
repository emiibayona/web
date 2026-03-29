<template>
    <div>
        <h1 class="text-2xl font-bold mb-5">Panel de Admin > Ventas de Yugioh</h1>
        <Ventas :game="GAMES.YUGIOH" />
    </div>
</template>

<script setup>
import Ventas from '@/components/admin/Ventas.vue';
import { GAMES } from '@/utils/constants';
</script>

<style lang="scss" scoped></style>