import { defineStore } from "pinia";
import { ref } from "vue";
import SealedService from "@/services/SealedService";

export const useShopStore = defineStore("shop", () => {
  const shop = ref(null);
  const sealed = ref(null);

  async function fetchSealed(game, params = {}) {
    try {
      sealed.value = (await SealedService.list(game, params))?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return { shop, sealed, fetchSealed };
});
