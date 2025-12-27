// Import the reusable APIClient
import APIClient from "../../../../services/ApiClient";
// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("users");

export const registerService = (formData) => {
  // Use APIClient's post method
  // The third parameter allows custom headers (here we set multipart/form-data for file uploads)
  return authClient.post(formData, "register", {
    headers: {
      "Content-Type": "multipart/form-data", // Required when sending files
    },
  });
};
