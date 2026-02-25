import CardService from "@/services/CardService";
import { ref } from "vue";

const doubleFaces = ref(null);
const useCards = () => {
  const fetchDoubleFaces = async (cardIds) => {
    try {
      doubleFaces.value = await CardService.listDoubleFaces(cardIds);
    } catch (error) {
      return error;
    }
  };
  const getImages = (card) => {
    const sources = { hasDouble: false, faceUp: null, faceDown: null };
    if (!card?.image_uris) {
      const images = doubleFaces.value.filter((x) => x.cardId === card.id);

      sources.faceUp = images[0]?.image_uris?.large;
      sources.faceDown = images[1]?.image_uris?.large;
      sources.hasDouble = true;
    } else {
      sources.faceUp = card?.image_uris?.large;
    }
    return sources;
  };

  return { getImages, fetchDoubleFaces };
};

export default useCards;
