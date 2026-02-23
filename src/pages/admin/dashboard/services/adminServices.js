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

export const getFoodPostsService = () => {
  return authClient.get(`food-post/list`);
}

export const getFoodPostByIdService = (id) => {
  return authClient.get(`food-post/${id}/details`);
}

export const getDonationsOverTimeService = () => {
  return authClient.get(`donations-over-time`);
}

export const getFoodTypeDistributionService = () => {
  return authClient.get(`food-type-distribution`);
}

export const getRequestStatusOverviewService = () => {
  return authClient.get(`request-status-overview`);
}