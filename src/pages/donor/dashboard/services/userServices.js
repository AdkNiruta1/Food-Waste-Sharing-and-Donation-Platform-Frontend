import APIClient from "../../../../services/ApiClient";

const client = new APIClient("users");

export const donorStatsServices = () => {

  return client.get('/donor-stats');
};
