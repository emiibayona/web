import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import SetService from "@/services/SetService";

export const useSetStore = defineStore("set", () => {
  const sets = ref(null);

  async function fetchSets() {
    try {
      // TODO: force clean on releases
      const setsStorage = localStorage.getItem("sets");
      if (!setsStorage) {
        sets.value = await SetService.list();
        localStorage.setItem("sets", JSON.stringify(sets.value));
      } else {
        sets.value = JSON.parse(setsStorage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return { sets, fetchSets };
});
