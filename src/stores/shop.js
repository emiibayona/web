import { defineStore } from "pinia";
import { ref } from "vue";
import SealedService from "@/services/SealedService";

export const useShopStore = defineStore("shop", () => {
  const shop = ref(null);
  const sealed = ref(null);

  async function fetchSealed(game, params = {}) {
    try {
      sealed.value = await SealedService.list(game, params);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function createProduct(body) {
    try {
      await SealedService.create(body);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function updateProduct(body) {
    try {
      await SealedService.update(body);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function deleteProduct(body) {
    try {
      await SealedService.delete(body);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return {
    shop,
    sealed,
    fetchSealed,
    updateProduct,
    createProduct,
    deleteProduct,
  };
});
