import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import CollectionService from "@/services/CollectionService";

export const useCollectionStore = defineStore("collection", () => {
  const collection = ref(null);

  async function fetchCollection(user = "emii.bayona22@gmail.com", params) {
    try {
      collection.value = await CollectionService.list(user, params);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return { collection, fetchCollection };
});
