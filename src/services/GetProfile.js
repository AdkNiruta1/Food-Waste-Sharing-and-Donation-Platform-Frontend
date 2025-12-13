// Import the reusable APIClient class
import APIClient from "./ApiClient"; // Adjust the path based on your project structure

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("users/");

export const getMeService = () => {
  // Uses the `get` method from APIClient to fetch "me" data
  return authClient.get("me");
};
