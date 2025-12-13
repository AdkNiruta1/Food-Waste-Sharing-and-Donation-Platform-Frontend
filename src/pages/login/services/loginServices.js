import APIClient from "../../../services/ApiClient"; // path based on your project

const authClient = new APIClient("users");

export const loginUserService = (data) => {
  return authClient.post(data, "login");
};