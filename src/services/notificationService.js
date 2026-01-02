import APIClient from "./ApiClient";

const client = new APIClient("notifications");

export const notificationServices = async (page = 1, limit = 10) =>  {
  return client.get(`?page=${page}&limit=${limit}`);
};

export const markNotificationAsReadService = async (notificationId) => {
  return client.put({},`${notificationId}/read`);
};

export const markAllNotificationsAsReadService = async () => {
  return client.put({},"read-all");
};
export const deleteNotificationService = async (notificationId) => {
  return client.delete(`${notificationId}`);
}