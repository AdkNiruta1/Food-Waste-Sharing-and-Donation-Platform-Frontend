import APIClient from "../../../../services/ApiClient";

// Create an instance of APIClient for the "users" endpoint
const authClient = new APIClient("admin");

export const getDashboardStatsService = () => {
  // Use the APIClient's `get` method to fetch dashboard statistics
  return authClient.get("stats");
}

export const exportUserAnalyticsService = () => {
  // Use the APIClient's `get` method to export user analytics in the specified format
  return authClient.get(`export/users`, {
    responseType: "blob",
  });
}

export const exportFullReportService = () => {
  return authClient.get("export/full-report", {
    responseType: "blob",
  });
};

export const exportFullReportMonthlyService = (month, year) => {
  return authClient.get(`export/full-report/${month}/${year}`, {
    responseType: "blob",
  });
}
