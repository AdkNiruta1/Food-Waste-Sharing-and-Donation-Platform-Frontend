import APIClient from "../../../../services/ApiClient"; 

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("admin");

export const getDashboardStatsService = () => {
  // Use the APIClient's `get` method to fetch dashboard statistics
  return authClient.get("stats");
}