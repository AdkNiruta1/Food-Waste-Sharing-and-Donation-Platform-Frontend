import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

export const donationServices = () => {

  return client.get('my');
};
export const deleteDonationServices = (id) => {

  return client.delete(`${id}`);
};

export const AcceptDonationServices = ( data) => {
  return client.post(data, "accept");
}

export const RejectDonationServices = ( data) => {
  return client.post(data, "reject");
}

export const getActiveDonationServices = () => {
  return client.get(`active`);
}

export const completePickupServices = (data) => {
  return client.post(data, "complete");
}
export const getActiveDonationsbyIdServices = (donationId) => {
  return client.get(`active/${donationId}`);
}