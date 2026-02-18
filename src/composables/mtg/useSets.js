import { useSetStore } from "@/stores/set";
import { GAMES } from "@/utils/constants";
import { computed } from "vue";

const useSets = (game = GAMES.MAGIC) => {
  const store = useSetStore();
  const sets = computed(
    () => JSON.parse(localStorage.getItem("sets")) || store.sets || [],
  );

  async function fetchSets() {
    try {
      await store.fetchSets();
    } catch (error) {
      return error;
    }
  }
  function getIconSet(setCode) {
    const set = sets.value.find((s) => s.code === setCode);
    return set ? set.icon_svg_uri : null;
  }
  return { fetchSets, sets, getIconSet };
};

export default useSets;
