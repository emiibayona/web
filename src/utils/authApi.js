import axios from "axios";
import { AuthApiURL } from "./constants";
const authApi = axios.create({
  baseURL: AuthApiURL, // La URL de tu API de Node
});

// Interceptor de peticiones
authApi.interceptors.request.use(
  (config) => {
    // 1. Sacamos el token del LocalStorage (o de tu store de Pinia/Vuex)
    const token = localStorage.getItem("token");

    // 2. Si el token existe, lo añadimos al header 'Authorization'
    if (token) {
      // Importante: usar el prefijo 'Bearer '
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Opcional: Interceptor de respuestas para manejar errores 401 (token expirado)
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el servidor dice que el token no vale, limpiamos y redirigimos
      console.log("Error on interceptor", error);
    }
    return Promise.reject(error);
  },
);

export default {
  get: async (path, options) => {
    try {
      const response = await authApi.get(path, options);
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  },
  post: async (path, data) => {
    try {
      const response = await authApi.post(path, data);
      return response.data;
    } catch (error) {
      console.error("POST request error:", error);
      throw error;
    }
  },
  put: async (path, data) => {
    try {
      const response = await authApi.put(path, data);
      return response.data;
    } catch (error) {
      console.error("PUT request error:", error);
      throw error;
    }
  },
  patch: async (path, data) => {
    try {
      const response = await authApi.patch(path, data);
      return response.data;
    } catch (error) {
      console.error("PATCH request error:", error);
      throw error;
    }
  },
  delete: async (path, data) => {
    try {
      const response = await authApi.delete(path, data);
      return response.data;
    } catch (error) {
      console.error("DELETE request error:", error);
      throw error;
    }
  },
};
