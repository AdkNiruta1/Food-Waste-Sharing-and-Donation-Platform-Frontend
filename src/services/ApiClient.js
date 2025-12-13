// Import axios for making HTTP requests
import axios from "axios";

// Import base API URL from constants
import { BASE_URL } from "../constants/constants";

/**
 * Create a reusable Axios instance
 * This helps keep configuration consistent across the app
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all API requests
  headers: {
    Accept: "application/json", // Expect JSON responses
    "Content-Type": "application/json", // Send JSON data
  },
  timeout: 5000, // Request will fail if it takes more than 5 seconds
  withCredentials: true, // Send cookies (useful for auth sessions)
});

/**
 * Axios response interceptor
 * Handles successful responses and errors globally
 */
axiosInstance.interceptors.response.use(
  // If request is successful, just return the response
  (response) => response,

  // If an error occurs, format and return a custom error object
  (error) => {
    const message =
      error?.response?.data?.message || // Backend error message
      error?.message ||                 // Axios error message
      "Something went wrong. Please try again later.";

    const statusCode = error?.response?.status || 500;

    // Reject with a custom error format
    return Promise.reject({ message, statusCode });
  }
);

/**
 * Generic API Client class
 * Used to handle CRUD operations for any endpoint
 */
class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint; // API endpoint (e.g. "/users", "/posts")
  }

  /**
   * GET all data or data with params
   */
  getAll = async (params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get(url, config);
    return response.data;
  };

  /**
   * GET a single resource
   */
  get = async (params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get(url, config);
    return response.data;
  };

  /**
   * POST (create) data
   */
  post = async (data, params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  };

  /**
   * DELETE a resource
   */
  delete = async (params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.delete(url, config);
    return response.data;
  };

  /**
   * PUT (update) data
   */
  put = async (data, params, config) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  };
}

// Export APIClient so it can be reused across the app
export default APIClient;
