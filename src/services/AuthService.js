import authApi from "@/utils/authApi";

export default {
  profile: async function () {
    return authApi
      .get(`auth/profile/`)
      .then((res) => res)
      .catch((error) => error.response);
  },
};
