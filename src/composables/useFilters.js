import { computed } from "vue";
import { GAMES } from "@/utils/constants.js";
const useFilters = (game = GAMES.MAGIC) => {
  const magicFilters = computed(() => {
    const magic = {
      Type: [
        { label: "Artifact", value: "artifact", checked: false },
        { label: "Battle", value: "battle", checked: false },
        { label: "Creature", value: "creature", checked: false },
        { label: "Enchantment", value: "enchantment", checked: false },
        { label: "Instant", value: "instant", checked: false },
        { label: "Kindred", value: "kindred", checked: false },
        { label: "Land", value: "land", checked: false },
        { label: "Legendary", value: "legendary", checked: false },
        { label: "Planeswalker", value: "planeswalker", checked: false },
        { label: "Sorcery", value: "sorcery", checked: false },
      ],
      Rarity: [
        { label: "Common", value: "common", checked: false },
        { label: "Uncommon", value: "uncommon", checked: false },
        { label: "Rare", value: "rare", checked: false },
        { label: "Mythic", value: "mythic", checked: false },
        { label: "Special", value: "special", checked: false },
        { label: "Basic Land", value: "basicland", checked: false },
      ],
      Colors: [
        { label: "White", value: "W", checked: false },
        { label: "Blue", value: "U", checked: false },
        { label: "Black", value: "B", checked: false },
        { label: "Red", value: "R", checked: false },
        { label: "Green", value: "G", checked: false },
        { label: "Colorless", value: "CLS", checked: false },
      ],
    };

    if (game === GAMES.MAGIC) return magic;
    return {};
  });

  return { magicFilters };
};

export default useFilters;
