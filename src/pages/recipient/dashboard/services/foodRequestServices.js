import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

export const getListFoodRequestsService = () => {
  return client.get(`my/requests`);
}
export const getFoodRequestDetailsService = (id) => {
  return client.get(`${id}/requests-details`);
}
export const cancelFoodRequestService = (id) => {
  return client.get(`$/request/cancel/${id}`);
}