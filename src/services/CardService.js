import api from "@/utils/api";

export default {
  listDoubleFaces: async function (cardIds) {
    return api
      .post(`cards/images/faces`, cardIds)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
