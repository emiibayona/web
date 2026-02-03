import api from "@/utils/api";

export default {
  list: async function (user, params) {
    return api
      .get(`collections/user/${user}`, { params: params })
      .then((res) => res)
      .catch((error) => error.response);
  },
};
