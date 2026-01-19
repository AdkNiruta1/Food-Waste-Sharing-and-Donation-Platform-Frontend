import APIClient from "../../../../services/ApiClient"; 

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("admin");
export const getFoodPostServices = ({ page = 1, limit = 10, search = "" } = {}) => {
  const query = `page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
  return authClient.get(`food-post?${query}`);
};

