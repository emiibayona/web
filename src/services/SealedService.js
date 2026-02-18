import api from "@/utils/api";

export default {
  list: async function (game, params) {
    return api
      .get(`products/sealed/${game}`, { params: params })
      .then((res) => res)
      .catch((error) => error.response);
  },
};
