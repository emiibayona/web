
import { useAuthStore } from "@/stores/auth";
import { cleanOrUpdateCarts } from "@/utils/cartUtils";
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

export function useAuth() {
  const store = useAuthStore();
  const user = computed(() => store.user);
  const loading = computed(() => store.loading);
  const token = ref(localStorage.getItem("token") || null);
  const router = useRouter();
  const route = useRoute();
  const toast = useToast();

  // Getters reactivos
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => (isAuthenticated.value && user.value?.Tenants[0]?.role || user.value?.Tenants[0]?.UserTenant?.role) === 'ADMIN')


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
    const key = `loggedUser_${userData?.tenant || 'geartown'}`;
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
    store.updateLoading(true);
    cleanOrUpdateCarts(user?.value?.email, { cart: true, wish: true, user: true }, [])
    setTimeout(() => {
      token.value = null;
      _updateUser(null);
      localStorage.removeItem("token");
      store.updateLocal(null);
      store.updateLoading(false);
      router.push('/')
    }, 1000)
  };

  // Iniciar flujo con Google (Recibe el tenant actual)
  const loginWithGoogle = (tenantSlug = "geartown", redirect) => {
    store.updateLoading(true);
    const backendUrl = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8089";
    const origin = window.location.origin;
    window.location.href = `${backendUrl}/api/auth/google?origin=${origin}&tenant=${tenantSlug}&redirect=${encodeURIComponent(redirect || window.location.href)}`;
  };

  const loginWithLocal = async (body, redirect) => {
    try {

      store.updateLoading(true);
      const loginResult = await store.loginLocal({ ...body, redirect });
      if (loginResult.status === 500) {
        store.updateLoading(false);
        toast.add({
          severity: "error",
          summary: "Error en conexión",
          detail: loginResult.data.error.split("Something went wrong:")?.[1],
          life: 3000,
        })
        return;
      }
      if (loginResult.token) {
        toast.add({
          severity: "success",
          summary: "Conexión exitosa",
          detail: "",
          life: 3000,
        })
        router.push({ name: "Auth success", query: { ...loginResult } })
      }
    } catch (err) { console.error("!!!!!!!!!!" + err) }
  }

  async function register(body) {
    store.updateLoading(true);
    const resApi = await store.registerOnLogin(body);
    const resWeb = await store.registerOnWeb(body);
    if (resApi && resWeb) {
      await loginWithLocal(body, window.location.origin + (route?.redirectedFrom?.fullPath || '/'))
    }
  }

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
    updateLoading: store.updateLoading,
    loginWithLocal,
    register
  };
}
