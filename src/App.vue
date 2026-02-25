<template>

  <div class="px-8 h-full">
    <NavList
      class="flex flex-col nm:flex-row justify-center space-x-4 items-center py-5 px-20 z-20 bg-site hd:gap-5 hd2:gap-24" />
    <router-view>
    </router-view>
    <Toast position="bottom-right" />
    <!-- <Footer></Footer> -->
  </div>

</template>
<script setup>
import { computed, onBeforeMount } from 'vue';
import Footer from './components/atomic/Footer.vue';
import NavList from './components/NavList.vue';
import Toast from 'primevue/toast';
import useDevices from '@/composables/useDevices';
const devices = useDevices();
onBeforeMount(() => {
  localStorage.setItem("user", import.meta.env.VITE_SELLER_EMAIL);
  localStorage.setItem("seller", import.meta.env.VITE_SELLER_EMAIL);
})
</script>
