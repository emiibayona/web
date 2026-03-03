import api from "@/utils/api";

export default {
  uploadImage: async function (file) {
    return api
      .post(`files/image`, file)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
