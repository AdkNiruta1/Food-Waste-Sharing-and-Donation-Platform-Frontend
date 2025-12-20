import APIClient from "./ApiClient"; 

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("users");

export const LogoutService = () => {
  // Uses the `post` method from APIClient to post "logout" data
  return authClient.post({}, "logout");
};
