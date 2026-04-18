import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

// services/donationServices.js
export const donationServices = (page = 1, limit = 10) => {
  return client.get(`/my?page=${page}&limit=${limit}`);
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

// services/donationServices.js
export const getActiveDonationServices = (page = 1, limit = 10) => {
  return client.get(`/active?page=${page}&limit=${limit}`);
};

export const completePickupServices = (data) => {
  return client.post(data, "complete");
}
export const getActiveDonationsbyIdServices = (donationId) => {
  return client.get(`active/${donationId}`);
}