<template>
    <SealedPage :game="NAVIGATION.MAGIC.key" />
</template>

<script setup>
import SealedPage from '@/components/SealedPage.vue';
import { NAVIGATION } from '@/utils/constants';
</script>