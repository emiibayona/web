import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import CollectionService from "@/services/CollectionService";
import { GAMES } from "@/utils/constants";

export const useCollectionStore = defineStore("collection", () => {
  const collection = ref(null);
  const binders = ref(null);

  async function fetchCollection(params, user = null) {
    try {
      // TODO: Improve
      if (params.game === GAMES.MAGIC) {
        collection.value = await CollectionService.list(
          user || localStorage.getItem("seller"),
          params,
        );
      } else if (params.game === GAMES.YUGIOH) {
        collection.value = await CollectionService.listByGame(
          user || localStorage.getItem("seller"),
          params,
        );
      }
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  }
  async function getListToCart(body) {
    try {
      return await CollectionService.listToCart(body);
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

  async function updateCards(colId, arr, binder) {
    try {
      return await CollectionService.updateCards(colId, arr, binder);
    } catch (error) {
      console.error("Error updating amount of cards", error);
    }
  }

  // BINDERS
  async function fetchBinders(collectionId, query) {
    try {
      binders.value = await CollectionService.listBinders(collectionId, query);
    } catch (error) {
      console.error("Error fetching binder:", error);
    }
  }

  async function createBinders(params) {
    try {
      if (!params.collectionId) throw "collectionId required";
      return await CollectionService.createBinders(params);
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
    getListToCart,
  };
});
