// Import the reusable API client
import APIClient from "../../../services/ApiClient"; // Adjust the path based on your project structure

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("users");
export const loginUserService = (data) => {
  // Use the APIClient's `post` method to send login data
  // The second parameter "login" appends to the endpoint, resulting in "/users/login"
  return authClient.post(data, "login");
};
