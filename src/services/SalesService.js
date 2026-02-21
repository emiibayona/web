import api from "@/utils/api";

export default {
  list: async function (params, game) {
    return api
      .get(`orders/${game}`, { params: params })
      .then((res) => res)
      .catch((error) => error.response);
  },
  resumen: async function (game) {
    return api
      .get(`orders/${game}/resumen`)
      .then((res) => res)
      .catch((error) => error.response);
  },
  create: async function (order) {
    return api
      .post(`orders/${order.game}/`, order)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
