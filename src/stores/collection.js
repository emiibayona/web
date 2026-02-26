import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import CollectionService from "@/services/CollectionService";

export const useCollectionStore = defineStore("collection", () => {
  const collection = ref(null);
  const binders = ref(null);

  async function fetchCollection(params, user = null) {
    try {
      collection.value = await CollectionService.list(
        user || localStorage.getItem("seller"),
        params,
      );
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  }

  async function addCardsToCollection(params) {
    try {
      return await CollectionService.addCards(params);
    } catch (error) {
      console.error("Error fetching binder:", error);
    }
  }

  async function updateCards(colId, arr) {
    try {
      return await CollectionService.updateCards(colId, arr);
    } catch (error) {
      console.error("Error updating amount of cards", error);
    }
  }

  // BINDERS
  async function fetchBinders(collectionId) {
    try {
      binders.value = await CollectionService.listBinders(collectionId);
    } catch (error) {
      console.error("Error fetching binder:", error);
    }
  }

  async function createBinders(params) {
    try {
      if (!params.collectionId) throw "collectionId required";
      await CollectionService.createBinders(params);
    } catch (error) {
      console.error("Error creating binder", error);
    }
  }

  return {
    addCardsToCollection,
    collection,
    binders,
    createBinders,
    fetchBinders,
    fetchCollection,
    updateCards,
  };
});
