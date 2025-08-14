<template>
  <head>
    <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
  </head>
  <div class="p-6 bg-header min-h-[500px]">
    <HeaderVue></HeaderVue>
  </div>
  <main>
    <div class="flex flex-col w-full justify-around bg-main p-6">
      <NavList class="hidden md:flex space-x-4 justify-around items-center" />

      <Hr class="mask-x-from-70% mask-x-to-70%" />
      <h1 class="self-center text-center font-bold">
        ESTAMOS TRABJANDO EN UN SITIO PARA USTEDES !!!
      </h1>
    </div>
    <!-- <Cta></Cta> -->
  </main>
  <!-- <Footer></Footer> -->
</template>

<script setup>
import HeaderVue from "./sections/Header.vue";
import NavList from "@/components/NavList.vue";
import Hero from "./sections/Hero.vue";
import Feature from "./sections/Feature.vue";
import Testimonial from "./sections/Testimonial.vue";
import Cta from "./sections/Cta.vue";
import Footer from "./sections/Footer.vue";
</script>

<style scoped lang="scss">
.bg-header {
  background-position: center;
  background-repeat: no-repeat;

  animation: opening 2s ease-in;
  animation-fill-mode: both;
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
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(255, 0, 0, 1),
    rgba(0, 0, 0, 0)
  );
}
</style>
