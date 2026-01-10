import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

export const donationServices = () => {

  return client.get('my');
};
export const deleteDonationServices = (id) => {

  return client.delete(`${id}`);
};