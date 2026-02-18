import { computed } from "vue";

const useUser = () => {
  const user = computed(() => {
    return localStorage.getItem("user") || null;
  });
  const seller = computed(() => {
    return localStorage.getItem("seller") || null;
  });
  return { user, seller };
};
export default useUser;
