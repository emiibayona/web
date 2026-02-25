import api from "@/utils/api";

export default {
  list: async function (user, params) {
    return api
      .get(`collections/user/${user}`, { params: params })
      .then((res) => res)
      .catch((error) => error.response);
  },
  addCards: async function name(params) {
    return api
      .post(`collections/add`, params)
      .then((res) => res)
      .catch((error) => error.response);
  },
  // BINDERS
  listBinders: async function (collectionId) {
    return api
      .get(`collections/${collectionId}/binders`)
      .then((res) => res)
      .catch((error) => error.response);
  },
  createBinders: async function ({ collectionId, body }) {
    return api
      .post(`collections/${collectionId}/binders`, body)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
