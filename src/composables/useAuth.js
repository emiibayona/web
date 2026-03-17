import AuthService from "@/services/AuthService";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// Estado global fuera de la función para que sea persistente entre componentes
// const user = ref(null);
// const token = ref(localStorage.getItem("token") || null);
// const loading = ref(false);

const savedUser = localStorage.getItem("loggedUser");
const user = ref(savedUser ? JSON.parse(savedUser) : null);
const token = ref(localStorage.getItem("token") || null);
const loading = ref(false);

export function useAuth() {
  const router = useRouter();

  // Getters reactivos
  const isAuthenticated = computed(() => !!token.value);

  // Función interna para sincronizar localStorage y estado reactivo
  const _updateUser = (userData) => {
    user.value = userData;
    if (userData) {
      localStorage.setItem("loggedUser", JSON.stringify(userData));
    } else {
      localStorage.removeItem("loggedUser");
    }
  };

  // Guardar sesión
  const setSession = (newToken, userData = null) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
    if (userData) _updateUser(userData);
  };

  const fetchProfile = async (force = false) => {
    // Si ya tenemos usuario y no estamos forzando la carga, no llamamos al API
    if (user.value && !force) return;

    if (!token.value) return;

    loading.value = true;
    try {
      const data = await AuthService.profile();
      console.log("fetchProfile =>", data);
      _updateUser(data);
    } catch (err) {
      console.log("ERror con fetch profile", err);
      logout();
    } finally {
      loading.value = false;
    }
  };

  // Cerrar sesión
  const logout = () => {
    token.value = null;
    _updateUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Iniciar flujo con Google (Recibe el tenant actual)
  const loginWithGoogle = (tenantSlug = "geartown") => {
    const backendUrl = "http://localhost:8089";
    // const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8089";
    const origin = window.location.origin;
    // Redirigimos al backend pasando el origin y el tenant para el parámetro 'state'
    window.location.href = `${backendUrl}/api/auth/google?origin=${origin}&tenant=${tenantSlug}`;
  };
  onMounted(async () => {
    if (!user.value) await fetchProfile();
  });

  return {
    user,
    token,
    loading,
    isAuthenticated,
    setSession,
    fetchProfile,
    logout,
    loginWithGoogle,
  };
}
