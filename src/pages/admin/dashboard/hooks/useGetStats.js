import { useState } from "react";
import { getDashboardStatsService } from "../services/adminServices";

export const useGetDashboardStats = () => {
  // Store dashboard statistics data
  const [stats, setStats] = useState({});

  // Track loading state
  const [loading, setLoading] = useState(false);

  // Main function to fetch dashboard statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStatsService();
      setStats(res.data || {}); // Save fetched data
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose stats and fetch function
  return { stats, loading, fetchStats };
};
