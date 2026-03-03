import api from "@/utils/api";

export default {
  list: async function (game, params) {
    return api
      .get(`products/sealed/${game}`, { params: params })
      .then((res) => res?.data)
      .catch((error) => error.response);
  },
  create: async function (body) {
    return api
      .post(`products/sealed/`, body)
      .then((res) => res?.data)
      .catch((error) => error.response);
  },
  update: async function (body) {
    return api
      .patch(`products/sealed/${body.id}`, body)
      .then((res) => res?.data)
      .catch((error) => error.response);
  },
  delete: async function ({ id, type }) {
    return api
      .delete(`products/sealed/${id}/${type}`)
      .then((res) => res?.data)
      .catch((error) => error.response);
  },
};
