import APIClient from "../../../../services/ApiClient";

const authClient = new APIClient("users");

// Create an instance of APIClient for the "users" endpoint
export const SendOtpService = (data) => {
  return authClient.post(data, "forget-password/send-otp");
};
export const VerifyOtpService = (data) => {
  return authClient.post(data, "forget-password/verify-otp");
};
export const resetPasswordService = (data) => {
  return authClient.put(data, "reset-password");
};
