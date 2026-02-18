import api from "@/utils/api";

export default {
  list: async function (params) {
    return api
      .get(`info/sets`)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
