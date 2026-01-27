import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");
// get all donations
export const donationServices = () => {

  return client.get('my');
};
// delete donation
export const deleteDonationServices = (id) => {

  return client.delete(`${id}`);
};
// accept donation
export const AcceptDonationServices = ( data) => {
  return client.post(data, "accept");
}
// reject donation
export const RejectDonationServices = ( data) => {
  return client.post(data, "reject");
}