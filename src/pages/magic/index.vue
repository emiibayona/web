<template>
    <div class="flex flex-col gap-4 nm:min-h-[calc(100vh-250px)] nm:mt-10">
        <div class="grid grid-cols-1 nm:grid-cols-2 gap-4 ">
            <AnimatedBanner size="big" text="Singles"
                :bg="{ src: 'https://assets-prd.ignimgs.com/2023/07/13/mtg-lotr-1-1689261247953.jpg' }"
                path="singles" />
            <AnimatedBanner size="big" text="Sellado"
                :bg="{ src: 'https://images.ctfassets.net/s5n2t79q9icq/2pPpT9fn5Lgo4nCRWxkyvW/3897a2fbfec2ac6964011156a1b8c214/3H8hMTEhhnho_HeroHeader_1600x1080.png?q=70&w=1920&fm=webp' }"
                path="sealed" />
        </div>

        <AnimatedBanner size="big" text="Mi colección" :bg="{ src: '/images/mtg/magic-collection.jpg' }" :path="null"
            @click="() => router.push('user/magic/collection')" />
    </div>
</template>

<script setup>
import AnimatedBanner from '@/components/AnimatedBanner.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style lang="scss" scoped></style>