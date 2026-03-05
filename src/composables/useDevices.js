import { ref, onMounted, onUnmounted, computed, h } from "vue";

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const useDevices = () => {
  const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    // console.log(width.value, height.value);
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    width,
    height,
  };
};

export default useDevices;
