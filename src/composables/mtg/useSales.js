import { ref, computed, watch } from "vue";
import { useSalesStore } from "@/stores/sales";

const useSales = () => {
  const store = useSalesStore();
  const sales = computed(() => store.sales);
  const fetchSales = async (params) => {
    try {
      await store.fetchSales(params);
    } catch (error) {
      console.error(error);
    }
  };

  const updateSales = async (params) => {};
  const fetchSalesResumen = async () => {
    return await store.fetchOrderResumen();
  };

  const parseCart = (game, values) => {
    const cart = [];
    switch (game) {
      case "magic":
        values?.forEach((x) => {
          x.sets.forEach((y) => {
            cart.push({
              name: x.name,
              sold: 0,
              quantity: y.qty,
              cardId: y.cardId,
              treatment: y.treatment,
              image: y.image,
              set: {
                code: y.set.code,
                id: y.set.id,
                icon_svg_uri: y.set.icon_svg_uri,
                name: y.set.name,
              },
            });
          });
        });
        break;
      default:
        cart = [...values];
        break;
    }
    return cart;
  };
  const createOrder = async ({ name: game, values, form }) => {
    // debugger;
    const result = await store.createOrder({
      ...form,
      game,
      cards: parseCart(game, values),
    });
    return result;
  };

  const confirmOrder = async (sale, forceClose = false) => {
    return await store.confirmOrder({ ...sale, cards: sale.cart, forceClose });
  };

  return {
    confirmOrder,
    createOrder,
    fetchSales,
    updateSales,
    fetchSalesResumen,
    sales,
  };
};

export default useSales;
