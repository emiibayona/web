import { ref } from "vue";

const useCards = () => {
  const getImages = (card) => {
    const sources = { hasDouble: false, faceUp: null, faceDown: null };
    if (
      card?.card_faces?.length &&
      card?.card_faces?.every((x) => x.image_uris)
    ) {
      sources.faceUp = card.card_faces[0]?.image_uris?.large;
      sources.faceDown = card.card_faces[1]?.image_uris?.large;
      sources.hasDouble = true;
    } else {
      sources.faceUp = card?.image_uris?.large;
    }
    return sources;
  };

  return { getImages };
};

export default useCards;
