import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";

const adminUser = ref(null);
const loading = ref(false);
const useUser = () => {
  const toast = useToast();
  const adminKey = "admin_available";
  const user = computed(() => {
    return localStorage.getItem("user") || null;
  });
  const seller = computed(() => {
    return localStorage.getItem("seller") || null;
  });

  // ====================== ADMIN ZONE ======================
  const ttlAdmin = 240;
  function checkAdminPassword(pwd) {
    return pwd === import.meta.env.VITE_ADMIN_PASSWORD;
  }
  function getDiffTime(current) {
    return Math.floor(
      (new Date().getTime() - new Date(current).getTime()) / (1000 * 60),
    );
  }

  function loadAdmin() {
    loading.value = true;
    setAdmin(JSON.parse(localStorage.getItem(adminKey) || "null"));

    if (!adminIsLoggedIn.value) {
      setAdmin({ ...adminUser.value, logged: false });
    }
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function setAdmin(info) {
    adminUser.value = info;
  }

  const adminIsLoggedIn = computed(() =>
    adminUser?.value ? getDiffTime(adminUser.value.time) <= ttlAdmin : false,
  );

  loadAdmin();

  watch(
    adminUser,
    (newAdminUser) => {
      localStorage.setItem(adminKey, JSON.stringify(newAdminUser));
    },
    { deep: true },
  );

  // ====================== ADMIN ZONE ======================

  return {
    user,
    seller,
    // ADMIN
    userLoading: loading,
    adminUser,
    checkAdminPassword,
    setAdmin,
    adminIsLoggedIn,
  };
};
export default useUser;
