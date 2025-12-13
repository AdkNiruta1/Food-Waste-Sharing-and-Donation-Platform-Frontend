import APIClient from "../../../services/ApiClient"; // path based on your project

const authClient = new APIClient("users");

export const registerService = (formData) => {
  return authClient.post(formData, "register", {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};