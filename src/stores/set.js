import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import SetService from "@/services/SetService";

export const useSetStore = defineStore("set", () => {
  const sets = ref(null);

  async function fetchSets(game) {
    try {
      const setsStorage = JSON.parse(localStorage.getItem(`${game}_sets`) || `[]`);
      if (setsStorage?.length === 0 || import.meta.env.VITE_FORCE_LOAD_SETS) {
        sets.value = await SetService.list({ game });
        localStorage.setItem(`${game}_sets`, JSON.stringify(sets.value));
      } else {
        sets.value = JSON.parse(setsStorage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return { sets, fetchSets };
});
