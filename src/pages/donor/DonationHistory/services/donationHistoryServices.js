import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

export const donationHistoryServices = () => {
  return client.get('history');
};

export const getDonationHistoryByIdServices = (donationId) => {
  return client.get(`history/${donationId}`);
}