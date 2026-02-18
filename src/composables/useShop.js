import { useShopStore } from "@/stores/shop";
import { GAMES } from "@/utils/constants";
import { computed } from "vue";

const useShop = (game = GAMES.MAGIC) => {
  const store = useShopStore();
  const sealed = computed(() => store.sealed);

  const fetchSealedProducts = async (params = {}) => {
    await store.fetchSealed(game, params);
  };
  return { sealed, fetchSealedProducts };
};

export default useShop;
