import axios from "axios";
import { BASE_URL } from "../constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again later.";

    const statusCode = error?.response?.status || 500;

    return Promise.reject({ message, statusCode });
  }
);

class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  getAll = async (params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get(url, config);
    return response.data;
  };

  get = async (params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get(url, config);
    return response.data;
  };

  post = async (data, params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  };

  delete = async (params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.delete(url, config);
    return response.data;
  };

  put = async (data, params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  };
}

export default APIClient;
