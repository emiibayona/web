// import { fileURLToPath, URL } from "node:url";

// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: "/",
//   plugins: [vue()],
//   css: {
//     preprocessorOptions: {
//       scss: {
//         // Esto hace que el mixin esté disponible en todos lados sin importar nada
//         additionalData: `@use "@/assets/styles/_mixins.scss" as *;`,
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   },
//   server: {
//     port: 8080,
//     strictPort: true,
//     host: "0.0.0.0",
//     origin: "",
//     hmr: {
//       host: "localhost",
//     },
//   },
// });

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/",
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/_mixins.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Esta sección solo aplica en LOCAL
  server: {
    port: 8080,
    // host: true es más limpio que "0.0.0.0" y permite acceso por IP en tu red local
    host: true,
    strictPort: true,
    // Si usas Gitpod o Codespaces, hmr suele necesitar configuración especial,
    // pero para desarrollo local estándar, puedes omitir la parte de 'hmr'.
  },
  // Sugerencia: Añadir configuración de build para asegurar compatibilidad
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Limpia la carpeta antes de construir para evitar archivos viejos
    emptyOutDir: true,
  },
});
