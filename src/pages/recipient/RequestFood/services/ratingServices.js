import APIClient from "../../../../services/ApiClient";

const client = new APIClient("ratings");

export const submitRating = (data) => {
  return client.post(data, `rate`);
}
export const getFoodRequestDetailsService = (id) => {
  return client.get(`${id}/requests-details`);
}
