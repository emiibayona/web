<template>
    <div class="flex flex-col gap-4 nm:min-h-[calc(100vh-250px)] nm:mt-10">
        <div class="grid grid-cols-1 nm:grid-cols-2 gap-4 ">
            <AnimatedBanner size="bigXL" text="Singles" :bg="{ src: '/images/yugioh/sealed-banner.jpg' }"
                path="singles" />
            <AnimatedBanner size="bigXL" text="Sellado" :bg="{ src: '/images/yugioh/sealed-banner.jpg' }"
                path="sealed" />
        </div>
    </div>

</template>

<script setup>
import AnimatedBanner from '@/components/AnimatedBanner.vue';
</script>

<style lang="scss" scoped></style>