<template>
  <section id="cta" class="bg-brightRed mt-10 text-white">
    <!-- Flex Container -->
    <div
      class="py-24 px-6 flex flex-col md:flex-row items-center justify-between md:baseline container mx-auto space-y-8"
    >
      <!-- Heading -->
      <h2 class="text-5xl font-bold text-center md:w-2/3 md:text-start">
        Simplify how your team works today
      </h2>
      <!-- Button -->
      <MainButton class="bg-white text-brightRed hover:bg-veryDarkBlue w-fit"
        >Get Started</MainButton
      >
    </div>
  </section>
</template>
<script setup>
import MainButton from "../components/MainButton.vue";
</script>
