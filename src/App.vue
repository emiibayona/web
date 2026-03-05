<template>

  <div class="h-full bg-site">
    <NavList />
    <router-view class="bg-site px-2 nm:px-8">
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
