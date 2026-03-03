import { useShopStore } from "@/stores/shop";
import { GAMES } from "@/utils/constants";
import { computed, ref } from "vue";

const useShop = (game = GAMES.MAGIC) => {
  const store = useShopStore();
  const sealed = computed(() => store.sealed);
  const loading = ref(false);

  const fetchSealedProducts = async (params = {}) => {
    loading.value = true;
    await store.fetchSealed(game, params);
    loading.value = false;
  };

  const createProduct = async (form) => {
    try {
      await store.createProduct(form);
    } catch (error) {
      console.error(error);
    }
  };
  const updateProduct = async (form) => {
    try {
      await store.updateProduct(form);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (form) => {
    try {
      await store.deleteProduct(form);
    } catch (error) {
      console.error(error);
    }
  };
  return {
    loading,
    sealed,
    fetchSealedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useShop;
