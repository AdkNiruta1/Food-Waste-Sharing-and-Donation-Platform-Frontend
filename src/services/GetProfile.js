import APIClient from "./ApiClient"; 

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("users");

export const getMeService = () => {
  // Uses the `get` method from APIClient to fetch "me" data
  return authClient.get("me");
};

export const updateProfileService = (formData) => {
  // Uses the `get` method from APIClient to fetch profile data for a specific user
  return authClient.put(formData, `update-profile`);
}
export const updateProfilePhotoService = (formData) => {
  // Uses the `put` method from APIClient to update profile photo for a specific user
  return authClient.put(formData, `update-photo`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}