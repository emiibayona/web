import { defineStore } from "pinia";
import { ref } from "vue";
import AuthService from "@/services/AuthService";

export const useAuthStore = defineStore("auth", () => {
    const user = ref(null);
    const isHydrated = ref(false);
    const loading = ref(false);
    const token = ref(localStorage.getItem("token") || null);

    // Guardamos la promesa para evitar colisiones de llamadas simultáneas
    let loadPromise = null;
    async function fetchUser({ tenant, force = false }) {
        if (!token.value) return;
        if (isHydrated.value && !force) return;
        if (loadPromise) return loadPromise;

        loadPromise = (async () => {
            loading.value = true;
            try {
                const key = `loggedUser_${tenant || 'geartown'}`
                const userOnStorage = sessionStorage.getItem(key);

                if (userOnStorage === 'undefined' || !userOnStorage) {
                    const response = await AuthService.profile();

                    // Hidratamos el estado global
                    if (response) {
                        user.value = response;
                    }

                } else {
                    user.value = JSON.parse(userOnStorage);
                }

                isHydrated.value = true;

            } catch (error) {
                console.error("Error al hidratar el usuario:", error);
            } finally {
                loading.value = false;
                loadPromise = null;
            }
        })();

        return loadPromise;
    }

    async function loginLocal(body) {
        try {
            if (!body) throw "Body required";

            return await AuthService.loginLocal(body);
        } catch (error) {
            return error;
        }
    }

    async function updateLocal(tenant, newData) {
        user.value = newData;
    }
    function updateLoading(val) {
        loading.value = val;
    }

    async function registerOnLogin(body) {
        try {
            if (!body) return;
            return await AuthService.registerOnLogin(body);
        } catch (error) {

        }
    }
    async function registerOnWeb(body) {
        try {
            if (!body) return;
            return await AuthService.registerOnWeb(body);
        } catch (error) {

        }
    }

    return {
        loading,
        user,
        fetchUser,
        updateLocal,
        updateLoading,
        loginLocal,
        registerOnLogin,
        registerOnWeb
    }
});