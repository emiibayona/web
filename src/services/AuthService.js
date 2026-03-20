import authApi from "@/utils/authApi";

export default {
  profile: async function () {
    return authApi
      .get(`auth/profile/`)
      .then((res) => res)
      .catch((error) => error.response);
  },
  register: async function (params) {
    return authApi
      .post(`auth/profile/`, params)
      .then((res) => res)
      .catch((error) => error.response);
  },
  loginLocal: async function (params) {
    return authApi
      .post(`auth/login/`, params)
      .then((res) => res)
      .catch((error) => error.response);
  }
};
