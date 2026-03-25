import { useSetStore } from "@/stores/set";
import { GAMES } from "@/utils/constants";
import { computed } from "vue";

const useSets = (game = GAMES.MAGIC) => {
  const store = useSetStore();
  const sets = computed(
    () => JSON.parse(localStorage.getItem(`${game}_sets`)) || store.sets || [],
  );

  async function fetchSets() {
    try {
      await store.fetchSets(game);
    } catch (error) {
      return error;
    }
  }
  function getIconSet(setCode) {
    if (game === GAMES.MAGIC) {
      const set = sets.value.find((s) => s.code === setCode);
      return set ? set.icon_svg_uri : null;
    }

    return ""
  }
  return { fetchSets, sets, getIconSet };
};

export default useSets;
