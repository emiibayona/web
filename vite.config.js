import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // Esto hace que el mixin esté disponible en todos lados sin importar nada
        additionalData: `@use "@/assets/styles/_mixins.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    host: "0.0.0.0",
    origin: "",
    hmr: {
      host: "localhost",
    },
  },
});
