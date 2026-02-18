import { useCollectionStore } from "@/stores/collection";
import { computed, ref } from "vue";
import useCards from "./useCards";
const useCollection = () => {
  const store = useCollectionStore();
  const { getImages } = useCards();

  const fetching = ref(false);
  const collectionMapped = ref([]);
  const collection = computed(() => store.collection);
  const onFetching = computed(() => fetching.value);

  async function fetchCollection(params, user) {
    fetching.value = true;

    await store.fetchCollection(params, user);

    collectionMapped.value =
      collectionMapped.value?.length === collection.value.data.length
        ? collectionMapped.value
        : [];
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

  return {
    fetching,
    onFetching,
    fetchCollection,
    collectionMapped,
    collection,
  };
};

export default useCollection;
