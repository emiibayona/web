import { ref, onMounted, onUnmounted, computed, h } from "vue";

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const isMobile = ref(false);
const platform = ref('unknown');

const useDevices = () => {
  const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });


  const checkDevice = () => {
    // 1. Intento por API moderna
    if (navigator.userAgentData) {
      isMobile.value = navigator.userAgentData.mobile;
      platform.value = navigator.userAgentData.platform;
    } else {
      // 2. Fallback por User Agent (Regex)
      isMobile.value = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      platform.value = navigator.platform;
    }
  };

  onMounted(() => {
    checkDevice();
  });
  return {
    width,
    height,
    isMobile,
    platform,
  };
};

export default useDevices;
