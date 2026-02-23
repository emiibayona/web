import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import SalesService from "@/services/SalesService";
import { GAMES } from "@/utils/constants";

export const useSalesStore = defineStore("sales", () => {
  const sales = ref(null);
  const loading = ref(false);
  async function fetchSales(params, game = GAMES.MAGIC) {
    sales.value = null;
    try {
      sales.value = await SalesService.list(game, params);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchOrderResumen(game = GAMES.MAGIC) {
    try {
      return await SalesService.resumen(game);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function createOrder(order) {
    try {
      return await SalesService.create(order);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  async function confirmOrder(order) {
    try {
      return await SalesService.confirm(order);
    } catch (error) {
      console.error(error);
    }
  }

  return { sales, confirmOrder, createOrder, fetchSales, fetchOrderResumen };
});
