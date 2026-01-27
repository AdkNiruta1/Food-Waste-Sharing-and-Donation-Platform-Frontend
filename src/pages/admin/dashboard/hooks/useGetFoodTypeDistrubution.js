import { useState, useContext } from "react";
import { getFoodTypeDistributionService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFoodTypeDistrubution = () => {
  // Store food type distribution data
  const [foodType, setFoodType] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch food type distribution
  const fetchFoodTypeDistribution = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodTypeDistributionService();
      setFoodType(res.data); // Save fetched data
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch food type", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return {
    foodType,
    loading,
    error,
    fetchFoodTypeDistribution,
  };
};
