import { useCollectionStore } from "@/stores/collection";
import { computed, ref } from "vue";
import useCards from "./useCards";
import { GAMES } from "@/utils/constants";
const useCollection = (game = GAMES.MAGIC) => {
  const store = useCollectionStore();
  const { getImages, fetchDoubleFaces } = useCards();

  const fetching = ref(false);
  const collectionMapped = ref([]);
  const collection = computed(() => store.collection);
  const binders = computed(() => store.binders);
  const onFetching = computed(() => fetching.value);

  async function fetchCollection(
    params,
    user = localStorage.getItem("seller"),
  ) {
    fetching.value = true;
    await store.fetchCollection({ ...params, game }, user);

    collectionMapped.value =
      collectionMapped.value?.length === collection.value?.data?.length
        ? collectionMapped?.value
        : [];

    if (game === GAMES.MAGIC) {
      await fetchDoubleFaces(collection.value?.data?.map((x) => x.cardId));
    } else if (game === GAMES.YUGIOH) {
      // collectionMapped.value = collection?.value?.data;
      console.log("COLLECTION ON YUGI", collectionMapped.value)
    }

    collection.value?.data?.forEach((cd, index) => {
      const cardToShow = { ...cd, image: getImages(cd?.card || cd, game) };
      if (collectionMapped.value?.length === collection.value.data.length) {
        collectionMapped.value[index] = cardToShow;
      } else {
        collectionMapped.value.push(cardToShow);
      }
    });

    setTimeout(() => {
      const element = document?.getElementById("app");
      fetching.value = false;
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  }

  async function fetchBinders(colId, query) {
    await store.fetchBinders(colId, query);
  }
  async function createBinder(params) {
    try {
      if (!params.name) throw "Name required";
      const res = await store.createBinders(params);
      await fetchBinders(params.collectionId);
      return res;
    } catch (error) {
      throw { message: "Composable error - creating binder", error };
    }
  }

  async function addCards(form) {
    return await store.addCardsToCollection(form);
  }

  async function updateCards(colId, arr, binder) {
    const res = await store.updateCards(colId, arr, binder);
  }

  async function getListToCart(list) {
    return await store.getListToCart(list);
  }

  return {
    fetching,
    onFetching,
    fetchCollection,
    fetchBinders,
    createBinder,
    collectionMapped,
    collection,
    binders,
    addCards,
    updateCards,
    getListToCart,
  };
};

export default useCollection;
