import APIClient from "../../../../services/ApiClient"; 

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("admin");
export const getAllUserService = () => {
  // Use the APIClient's `get` method to fetch all users
  // The second parameter "users" appends to the endpoint, resulting in "/admin/users"
  return authClient.get("users");
};
export const getUserByIdService = (id) => {
  // Use the APIClient's `get` method to fetch all users
  // The second parameter "users" appends to the endpoint, resulting in "/admin/users"
  return authClient.get(`users/${id}`);

};
// Service to verify a user by ID
export const verifyUserService = (id) => {
  return authClient.put(`verify-user/${id}`);
};
// Service to reject a user by ID
export const rejectUserService = (id) => {
  return authClient.put(`reject-user/${id}`);
};
// Service to delete a user by ID
export const deleteUserService = (id) => {
  return authClient.delete(`delete-user/${id}`);
};
