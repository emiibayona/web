import api from "@/utils/api";

export default {
    fetch: async function ({ type, info }) {
        return api
            .get(`carts/${type}/`, { params: info })
            .then((res) => res)
            .catch((error) => error.response);
    },
    create: async function (cardIds) {
        return api
            .post(`carts/`, cardIds)
            .then((res) => res)
            .catch((error) => error.response);
    },
    update: async function (id, body) {
        return api
            .patch(`carts/${id}`, body)
            .then((res) => res)
            .catch((error) => error.response);
    },
};
