// import { ref, onMounted, onUnmounted, computed, h } from "vue";

// const useDevices = () => {
//   const width = ref(window.innerWidth);
//   const height = ref(window.innerHeight);

//   const handleResize = () => {
//     width.value = window.innerWidth;
//     height.value = window.innerHeight;
//     // console.log(width.value, height.value);
//   };

//   onMounted(() => {
//     window.addEventListener("resize", handleResize);
//   });

//   onUnmounted(() => {
//     window.removeEventListener("resize", handleResize);
//   });

//   return {
//     width,
//     height,
//   };
// };

// export default useDevices;

// import { ref, onMounted, onUnmounted, computed } from "vue";

// // 1. Move these OUTSIDE so they are global constants
// const width = ref(typeof window !== "undefined" ? window.innerWidth : 0);
// const height = ref(typeof window !== "undefined" ? window.innerHeight : 0);
// let listenerCount = 0;

// const handleResize = () => {
//   width.value = window.innerWidth;
//   height.value = window.innerHeight;
// };

// const useDevices = () => {
//   onMounted(() => {
//     // Only add the listener if it's the first component using it
//     if (listenerCount === 0) {
//       window.addEventListener("resize", handleResize);
//     }
//     listenerCount++;
//   });

//   onUnmounted(() => {
//     listenerCount--;
//     // Only remove if no more components are listening
//     if (listenerCount === 0) {
//       window.removeEventListener("resize", handleResize);
//     }
//   });

//   const isMobile = computed(() => width.value < 640);
//   const isTablet = computed(() => width.value >= 640 && width.value < 1024);
//   const isDesktop = computed(() => width.value >= 1024);

//   return { width, height, isMobile, isTablet, isDesktop };
// };

const useDevices = () => {};
export default useDevices;
