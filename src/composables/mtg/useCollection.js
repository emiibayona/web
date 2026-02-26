import { useCollectionStore } from "@/stores/collection";
import { computed, ref } from "vue";
import useCards from "./useCards";
const useCollection = () => {
  const store = useCollectionStore();
  const { getImages, fetchDoubleFaces } = useCards();

  const fetching = ref(false);
  const collectionMapped = ref([]);
  const collection = computed(() => store.collection);
  const binders = computed(() => store.binders);
  const onFetching = computed(() => fetching.value);

  async function fetchCollection(params, user) {
    fetching.value = true;

    await store.fetchCollection(params, user);

    collectionMapped.value =
      collectionMapped.value?.length === collection.value.data.length
        ? collectionMapped.value
        : [];

    await fetchDoubleFaces(collection.value?.data.map((x) => x.cardId));

    collection.value?.data?.forEach((cd, index) => {
      const cardToShow = { ...cd, image: getImages(cd.card) };
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

  async function fetchBinders(colId) {
    await store.fetchBinders(colId);
  }
  async function createBinder(params) {
    try {
      debugger;
      if (!params.body.name) throw "Name required";
      await store.createBinders(params);
      await fetchBinders(params.collectionId);
    } catch (error) {
      console.error("Composable error - creating binder", error);
    }
  }

  async function addCards(form) {
    return await store.addCardsToCollection(form);
  }

  async function updateCards(colId, arr) {
    const res = await store.updateCards(colId, arr);
    console.log("Removing card from collection as array");
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
  };
};

export default useCollection;
