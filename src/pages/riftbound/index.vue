<template>
    <div class="grid grid-cols-1 /*nm:grid-cols-2*/ gap-4 nm:min-h-[calc(100vh-250px)] nm:mt-10">
        <AnimatedBanner size="bigXl" text="Sellado" :bg="{ src: '/images/riftbound/sealed-banner.webp' }"
            path="sealed" />
    </div>

</template>

<script setup>
import AnimatedBanner from '@/components/AnimatedBanner.vue';
</script>

<style lang="scss" scoped></style>