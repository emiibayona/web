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
  function checkAdminPassword(pwd) {
    return pwd === import.meta.env.VITE_ADMIN_PASSWORD;
  }

  function loadAdmin() {
    loading.value = true;
    adminUser.value = JSON.parse(localStorage.getItem(adminKey) || "null");
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function setAdmin(info) {
    adminUser.value = info;
  }

  const adminIsLoggedIn = computed(() => {
    if (adminUser?.value) {
      const diff = Math.floor(
        (new Date().getTime() - new Date(adminUser.value.time).getTime()) /
          (1000 * 60),
      );
      if (diff >= 240) {
        adminUser.value = { ...adminUser.value, logged: false };
        toast.add({
          severity: "warn",
          summary: "Sesión caducada, reconectar",
          life: 2000,
        });
        return false;
      } else return true;
    } else {
      return false;
    }
  });

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
