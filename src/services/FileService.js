import api from "@/utils/api";

export default {
  uploadImage: async function (file) {
    return api
      .post(`files/image`, file)
      .then((res) => res)
      .catch((error) => error.response);
  },
  getCardsImage: async function ({ id, game, url }) {
    return api
      .get(`files/cards/${game}/${id}`, { params: { url } })
      .then((res) => res)
      .catch((error) => error.response);
  },
};
