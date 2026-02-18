import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Aura from "@primeuix/themes/aura";

import "./assets/main.css";
import router from "./router";
// Esto le dice a Vite: "Carga todas las imágenes de esta carpeta"
// Aunque no las uses ahora, Vite las incluirá en el build.
const images = import.meta.glob(
  "@/assets/images/**/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);
createApp(App)
  .use(createPinia())
  .use(ToastService)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false || "none",
      },
    },
  })
  .mount("#app");

// app;
