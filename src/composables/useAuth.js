
import { useAuthStore } from "@/stores/auth";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

export function useAuth() {
  const store = useAuthStore();
  const user = computed(() => store.user);
  const loading = computed(() => store.loading);
  const token = ref(localStorage.getItem("token") || null);

  const router = useRouter();

  // Getters reactivos
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => (user.value?.Tenants[0]?.role || user.value?.Tenants[0]?.UserTenant?.role) === 'ADMIN')


  const init = async () => {
    if (!store.isHydrated && !store.loading) {
      await store.fetchUser({
        tenant: "geartown",
      });
    }
  };

  // Función interna para sincronizar localStorage y estado reactivo
  const _updateUser = (userData) => {
    user.value = userData;
    const key = `loggedUser_${tenant || 'geartown'}`;
    if (userData) {
      sessionStorage.setItem(key, JSON.stringify(userData));
    } else {
      sessionStorage.removeItem(key);
    }
  };

  // Guardar sesión
  const setSession = (newToken, userData = null) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
    if (userData) _updateUser(userData);
  };

  const fetchUser = async (force = false) => {
    await store.fetchUser({
      tenant: "geartown",
    });
  };

  // Cerrar sesión
  const logout = () => {
    token.value = null;
    _updateUser(null);
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Iniciar flujo con Google (Recibe el tenant actual)
  const loginWithGoogle = (tenantSlug = "geartown", redirect) => {
    const backendUrl = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8089";
    const origin = window.location.origin;
    window.location.href = `${backendUrl}/api/auth/google?origin=${origin}&tenant=${tenantSlug}&redirect=${encodeURIComponent(redirect || window.location.href)}`;
  };

  watch(() => store.user, (newVal) => {
    sessionStorage.setItem(`loggedUser_${'geartown'}`, JSON.stringify(newVal))
  }, { deep: true })

  init();
  return {
    user,
    token,
    loading,
    isAuthenticated,
    setSession,
    fetchUser,
    logout,
    loginWithGoogle,
    isAdmin,
    updateLoading: store.updateLoading
  };
}
