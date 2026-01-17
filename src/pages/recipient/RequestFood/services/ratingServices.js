import APIClient from "../../../../services/ApiClient";

const client = new APIClient("ratings");

export const submitRating = (data) => {
  return client.post(data, `rate`);
}
export const getUserRatingsService = (userId) => {
  return client.get(`user/${userId}`);
}