<template>
    <SealedPage :game="NAVIGATION.YUGIOH.key" />
</template>

<script setup>
import SealedPage from '@/components/SealedPage.vue';
import { NAVIGATION } from '@/utils/constants';
</script>