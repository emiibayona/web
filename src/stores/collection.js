import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import CollectionService from "@/services/CollectionService";

export const useCollectionStore = defineStore("collection", () => {
  const collection = ref(null);

  async function fetchCollection(params, user = null) {
    try {
      collection.value = await CollectionService.list(
        user || localStorage.getItem("seller"),
        params,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return { collection, fetchCollection };
});
