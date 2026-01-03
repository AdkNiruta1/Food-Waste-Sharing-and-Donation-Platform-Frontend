import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

export const FoodServices = (page = 1, limit = 10) => {
  return client.get(`?page=${page}&limit=${limit}`);
};

export const getFoodDetailsService = (foodId) => {
  return client.get(`${foodId}`);
};