<template>

  <div class="h-full bg-site">
    <NavList />
    <router-view class="bg-site px-2 nm:px-8">
    </router-view>
    <Toast :position="devices.width.value > 1080 ? 'bottom-right' : 'top-center'" :base-z-index="999999">
      <template #message="slotProps">
        <div class="flex align-items-center gap-2" style="flex: 1">
          <img v-if="slotProps.message?.data?.image" :src="slotProps.message.data.image"
            :alt="slotProps.message.summary"
            style="width: 45px; aspect-ratio: 23/32; object-fit: cover; border-radius: 2px;" />
          <div class="flex flex-col gap-1">
            <span class="font-bold text-base">{{ slotProps.message.summary }}</span>
            <span class="text-xs">{{ slotProps.message.detail }}</span>
          </div>
        </div>
      </template>
    </Toast>
    <Analytics />
    <!-- <Footer></Footer> -->
  </div>

</template>
<script setup>
import { computed, onBeforeMount } from 'vue';
import Footer from './components/atomic/Footer.vue';
import NavList from './components/NavList.vue';
import Toast from 'primevue/toast';
import { Analytics } from '@vercel/analytics/vue';
import useDevices from '@/composables/useDevices';
const devices = useDevices();
onBeforeMount(() => {
  localStorage.setItem("user", import.meta.env.VITE_SELLER_EMAIL);
  localStorage.setItem("seller", import.meta.env.VITE_SELLER_EMAIL);
})
</script>
<style lang="scss" scoped></style>
