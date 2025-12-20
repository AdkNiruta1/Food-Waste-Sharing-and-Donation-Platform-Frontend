import APIClient from "../../../services/ApiClient"; 

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("users");
export const sendOtpService = (data) => {
  // Use the APIClient's `post` method to send login data
  // The second parameter "send-otp" appends to the endpoint, resulting in "/users/send-otp"
  return authClient.post(data, "send-otp");
};

export const verifyOtpService = (data) => {
  // Use the APIClient's `post` method to send login data
  // The second parameter "verify-otp" appends to the endpoint, resulting in "/users/verify-otp"
  return authClient.post(data, "verify-otp");
}