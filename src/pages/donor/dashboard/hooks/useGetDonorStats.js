import { useState, useContext } from "react";
import { donorStatsServices } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetDonorStats = () => {
  // Store donor-related food stats
  const [foods, setFoods] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch donor statistics
  const fetchDonorStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await donorStatsServices();
      setFoods(res.data); // Save fetched stats
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch donor stats", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return {
    foods,
    loading,
    error,
    fetchDonorStats,
  };
};
