import APIClient from "../../../../services/ApiClient";

const adminClient = new APIClient("activity-logs");

export const getUserLogsService = (userId, page = 1, limit = 10) => {
  return adminClient.get(`user/${userId}?page=${page}&limit=${limit}`);
};
export const getMyLogsService = ( page = 1, limit = 10) => {
  return adminClient.get(`my?page=${page}&limit=${limit}`);
};
