<template>
    <div class="p-6 bg-header min-h-[300px] px-4">
        <!-- <HeaderVue></HeaderVue> -->
    </div>
    <main>
        <div class="flex flex-col w-full justify-around bg-main px-4">
            <!-- <div class="flex flex-col w-full">
                <span class="text-xl">NEWS</span>
                <HeaderCarousel class="pb-4" />
            </div> -->

            <div class="flex flex-col w-full">
                <span class="text-xl font-bold pb-4">Nuestros juegos</span>
                <div class="grid hd:grid-cols-2 gap-4 grid-cols-1">
                    <AnimatedBanner v-for="(item, index) in data" :key="index" :img="item.logo" :bg="item.bg" big
                        :path="item.path" />

                </div>
            </div>

        </div>
    </main>
</template>

<script setup>
import { computed } from "vue";
import AnimatedBanner from "@/components/AnimatedBanner.vue";
import { NAVIGATION } from "@/utils/constants";

const data = computed(() => Object.values(NAVIGATION).filter(x => !x.home));
</script>

<style scoped lang="scss">
.bg-header {
    // height: 200px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;

    // animation: opening 2s ease-in-out;
    // animation-fill-mode: both;
    background-image: url("/public/images/banner.gif");
}

@keyframes opening {
    0% {
        background-image: url("/public/images/h1.png");
    }

    30% {
        background-image: url("/public/images/h2.png");
    }

    40% {
        background-image: url("/public/images/h3.png");
    }

    50% {
        background-image: url("/public/images/h4.png");
    }

    100% {
        background-image: url("/public/images/h5.png");
    }
}

h1 {
    font-size: 4rem;
}

hr {
    margin: 2rem 0px;
    border: 2px solid black;
    mask-image: linear-gradient(to right,
            rgba(0, 0, 0, 0),
            rgba(255, 0, 0, 1),
            rgba(0, 0, 0, 0));
}
</style>
