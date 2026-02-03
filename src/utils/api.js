import axios from "axios";
import { ApiURL } from "./constants";

export default {
  get: async (path, options) => {
    try {
      const response = await axios.get(ApiURL + path, options);
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  },
  post: async (path, data) => {
    try {
      const response = await axios.post(ApiURL + path, data);
      return response.data;
    } catch (error) {
      console.error("POST request error:", error);
      throw error;
    }
  },
  put: async (path, data) => {
    try {
      const response = await axios.put(ApiURL + path, data);
      return response.data;
    } catch (error) {
      console.error("PUT request error:", error);
      throw error;
    }
  },
  patch: async (path, data) => {
    try {
      const response = await axios.patch(ApiURL + path, data);
      return response.data;
    } catch (error) {
      console.error("PATCH request error:", error);
      throw error;
    }
  },
};
