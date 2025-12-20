import APIClient from "./ApiClient";

const authClient = new APIClient("users");

export const resetPasswordService = (data) => {
  return authClient.post(data, "reset-password");
};
