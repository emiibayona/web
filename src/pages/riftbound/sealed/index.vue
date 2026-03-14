<template>
    <SealedPage :game="NAVIGATION.RIFTBOUND.key" />
</template>

<script setup>
import SealedPage from '@/components/SealedPage.vue';
import { NAVIGATION } from '@/utils/constants';
</script>