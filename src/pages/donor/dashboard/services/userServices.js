import APIClient from "../../../../services/ApiClient";

const client = new APIClient("users");
// get all donors statistics
export const donorStatsServices = () => {

  return client.get('/donor-stats');
};
