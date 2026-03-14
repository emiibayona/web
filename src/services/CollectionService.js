import api from "@/utils/api";

export default {
  list: async function (user, params) {
    return api
      .get(`collections/user/${user}`, { params: params })
      .then((res) => res)
      .catch((error) => error.response);
  },
  listToCart: async function (body) {
    return api
      .post(`collections/to-cart/list`, body)
      .then((res) => res)
      .catch((error) => error.response);
  },
  addCards: async function name(params) {
    return api
      .post(`collections/add`, params)
      .then((res) => res)
      .catch((error) => error.response);
  },
  updateCards: async function name(colId, arr, binder) {
    // TODO: do the MAGIC
    return api
      .patch(`collections/${colId}`, { cards: arr, game: "magic", binder })
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
  createBinders: async function (body) {
    return api
      .post(`collections/${body.collectionId}/binders`, body)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
