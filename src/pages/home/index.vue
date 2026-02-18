<template>
    <div class="p-6 bg-header min-h-[300px]">
        <!-- <HeaderVue></HeaderVue> -->
    </div>
    <main>
        <div class="flex flex-col w-full justify-around bg-main">
            <div class="flex flex-col w-full">
                <span class="text-xl">NEWS</span>
                <HeaderCarousel class="pb-4" />
            </div>
            <!-- <NavList class="hidden md:flex space-x-4 justify-around items-center" :data="data" /> -->

            <!-- <hr class="mask-x-from-70% mask-x-to-70%" /> -->
            <!-- <h1 class="self-center text-center font-bold"> -->

            <div class="flex flex-col w-full">
                <span class="text-xl pb-4">Nuestros juegos</span>
                <div class="grid grid-cols-2 gap-4">

                    <AnimatedBanner path="magic" big
                        bg="https://images.ctfassets.net/s5n2t79q9icq/5Zat5j3qjx5diCvkurjKJG/6b3fa29fcd881e4080fd44a9db863bd4/fbnjsdoepqbueupnejiadvsd_1920x700.jpg?q=80" />
                    <AnimatedBanner
                        bg="https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/08/yugioh-1.jpg?w=1200&h=675&fit=crop"
                        text="Yu Gi Oh!!!" big />
                    <AnimatedBanner bg="https://champions.pokemon.com/_images/global/header/header-lg.jpg" big
                        img="
                        https://www.pokemon.com/static-assets/content-assets/cms2-es-es/img/trading-card-game/series/me_series/me01/me01_logo_169_es.png" />
                    <AnimatedBanner text="Digimon" big
                        bg="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkfPGewkn2AAbB5M98NlrAXvwykPbajfv7St2X3yWBZVg_z4TmkllnTHZgEnuB6hb8CUAineeD2kN8-eJrN8fXbhTcTX3SjYjMiC5wl6IFlQlwAWBwDrMfbauf-AybR71tT9gTO3wYsG8O/d/Digimon+Data+squad+savers.jpg" />

                </div>
            </div>
            <!-- </h1> -->
        </div>
        <!-- <Cta></Cta> -->
    </main>
    <!-- <Footer></Footer> -->
</template>

<script setup>
import HeaderCarousel from "@/components/HeaderCarousel.vue";
import HeaderVue from "@/sections/Header.vue";
import NavList from "@/components/NavList.vue";
import { computed } from "vue";
import AnimatedBanner from "@/components/AnimatedBanner.vue";
const data = computed(() => [
    { name: "Magic: The Gathering", path: "magic", },
    { name: "Yu Gi Oh!", path: "yu-gi-oh" },
    { name: "Digimon", path: "digimon" },
    { name: "Sobre nosotros", path: "about" },
]);
</script>

<style scoped lang="scss">
.bg-header {
    // height: 200px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;

    // animation: opening 2s ease-in-out;
    // animation-fill-mode: both;
    background-image: url("@/assets/img/banner.gif");
}

@keyframes opening {
    0% {
        background-image: url("@/assets/img/h1.png");
    }

    30% {
        background-image: url("@/assets/img/h2.png");
    }

    40% {
        background-image: url("@/assets/img/h3.png");
    }

    50% {
        background-image: url("@/assets/img/h4.png");
    }

    100% {
        background-image: url("@/assets/img/h5.png");
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
