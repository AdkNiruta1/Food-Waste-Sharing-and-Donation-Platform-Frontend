import { useState, useEffect } from "react";
import { getFoodRequestStatsService } from "../services/foodRequestServices";

export const useFoodRequestStats = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    completedRequests: 0,
    activeNow: 0,
    averageRating: 0,
    completedWithRatingCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodRequestStatsService();

      setStats({
        totalRequests: res.data.totalRequests,
        pendingRequests: res.data.pendingRequests,
        acceptedRequests: res.data.acceptedRequests,
        completedRequests: res.data.completedRequests,
        activeNow: res.data.activeNow,
        averageRating: res.data.averageRating,
        completedWithRatingCount: res.data.completedWithRatingCount,
      });

      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats, // optional manual refresh
  };
};