import APIClient from "./ApiClient"; // path based on your project

const authClient = new APIClient("users/");
export const getMeService = () => {
  return authClient.get("me");
};