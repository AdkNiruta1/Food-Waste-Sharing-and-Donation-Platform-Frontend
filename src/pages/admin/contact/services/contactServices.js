import APIClient from "../../../../services/ApiClient";

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("contact");

export const getContactMessagesService = (page = 1, limit = 10, search = "") => {
  let query = `page=${page}&limit=${limit}`;
  if (search) query += `&search=${encodeURIComponent(search)}`;

  return authClient.get(`?${query}`);
};

export const markMessageAsReadService = (id) => {
  return authClient.put({},`/${id}/read`);
};
export const deleteMessageService = (id) => {
  return authClient.delete(`/${id}`);
}