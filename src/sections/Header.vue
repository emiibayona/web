<template>
  <header>
    <nav class="flex justify-between items-center relative">
      <div></div>
     
      <MainButton class="hidden self-baseline md:block bg-moustard text-black font-bold">
        Login
      </MainButton>
      <DropDownNav />
    </nav>
  </header>
</template>
<script setup>
import MainButton from "../components/MainButton.vue";
import DropDownNav from "../components/DropDownNav.vue";

</script>
<style lang="sass" scoped></style>
