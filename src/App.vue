<template>

  <div class="px-10 h-full">

    <!-- sticky top-0 -->
    <NavList class="flex justify-center space-x-4 items-center gap-24 py-5 px-20 sticky top-0 z-20 bg-site" />
    <!-- <div class=""> -->
    <router-view>
    </router-view>
    <!-- </div> -->
    <Toast position="bottom-right" />
    <!-- <Footer></Footer> -->
  </div>

</template>
<script setup>
import { computed, onBeforeMount, onMounted } from 'vue';
import Footer from './components/atomic/Footer.vue';
import NavList from './components/NavList.vue';
import Toast from 'primevue/toast';
import useDevices from '@/composables/useDevices';
const devices = useDevices();
onBeforeMount(() => {
  localStorage.setItem("user", "emii.bayona22@gmail.com");
  localStorage.setItem("seller", "turco@gmail.com");
})
</script>
