<template>
  <section
    class="my-10 flex flex-col-reverse md:flex-row md:items-start items-center"
  >
    <div class="flex flex-col space-y-8 items-center md:items-start md:w-1/2">
      <div class="mx-4 md:mx-0">
        <h1
          class="font-bold text-4xl text-center md:text-5xl md:text-start my-6"
        >
          Bring everyone together to build better products
        </h1>
        <p class="text-darkGrayishBlue max-w-prose mx-6 md:mx-0">
          Manage makes it simple for software teams to plan day-to-day tasks
          while keeping the larger team goals in view.
        </p>
      </div>
      <MainButton class="bg-brightRed text-white">Get Started</MainButton>
    </div>
    <div class="md:w-1/2">
      <img src="../assets/img/illustration-intro.svg" alt="statistic" />
    </div>
  </section>
</template>
<script setup>
import MainButton from "../components/MainButton.vue";
</script>
