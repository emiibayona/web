<template>

  <div class="h-full bg-site" :class="{ 'pointer-events-none': loading }">
    <NavList />

    <Footer>
      <router-view class="bg-site px-2 nm:px-8">

      </router-view>
    </Footer>
    <Toast :position="isMobile ? 'bottom-center' : 'top-right'" :base-z-index="999999">
      <template #message="slotProps">
        <div class="flex align-items-center gap-2" style="flex: 1">
          <img v-if="slotProps.message?.data?.image" :src="slotProps.message.data.image"
            :alt="slotProps.message.summary"
            style="width: 45px; aspect-ratio: 23/32; object-fit: cover; border-radius: 2px;" />
          <div class="flex flex-col gap-1">
            <span class="font-bold text-base">{{ slotProps.message.summary }}</span>
            <span class="text-sm">{{ slotProps.message.detail }}</span>
          </div>
        </div>
      </template>
    </Toast>
    <div id="overlay" class="overlay"></div>
    <Analytics />

  </div>

</template>
<script setup>
import { computed, onBeforeMount, onMounted, watch } from 'vue';
import Footer from './components/atomic/Footer.vue';
import NavList from './components/NavList.vue';
import Toast from 'primevue/toast';
import { Analytics } from '@vercel/analytics/vue';
import useDevices from '@/composables/useDevices';
import { useAuth } from './composables/useAuth';
import useCarts from './composables/useCart';
const { isMobile } = useDevices();
const { user, loading } = useAuth();
const { init } = useCarts();
onBeforeMount(() => {
  const seller = localStorage.getItem("seller")
  if (!seller) {
    localStorage.setItem("seller", import.meta.env.VITE_SELLER_EMAIL);
  }
})
watch(user, () => {
  init();
})

</script>
<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 998;
}

.overlay.active {
  opacity: 1;
  pointer-events: auto;
}
</style>
