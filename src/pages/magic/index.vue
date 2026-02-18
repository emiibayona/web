<template>

    <div class="grid grid-cols-2 gap-4 min-h-[calc(100vh-250px)]">
        <AnimatedBanner big text="Singles" bg="https://assets-prd.ignimgs.com/2023/07/13/mtg-lotr-1-1689261247953.jpg"
            path="singles" />
        <AnimatedBanner big text="Sealed"
            bg="https://images.ctfassets.net/s5n2t79q9icq/2pPpT9fn5Lgo4nCRWxkyvW/3897a2fbfec2ac6964011156a1b8c214/3H8hMTEhhnho_HeroHeader_1600x1080.png?q=70&w=1920&fm=webp"
            path="sealed" />
    </div>

</template>

<script setup>
import AnimatedBanner from '@/components/AnimatedBanner.vue';
</script>

<style lang="scss" scoped></style>