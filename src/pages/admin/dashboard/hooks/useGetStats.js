import { useState } from "react";
import { 
  getDashboardStatsService
 } from "../services/adminServices";

export const useGetDashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStatsService();
      setStats(res.data || {});
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, fetchStats };
};
