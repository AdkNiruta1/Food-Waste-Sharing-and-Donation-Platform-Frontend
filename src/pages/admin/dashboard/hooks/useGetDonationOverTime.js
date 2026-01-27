import { useState, useContext } from "react";
import { getDonationsOverTimeService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetDonationOverTime = () => {
  // Store donation data
  const [foodPost, setFoodPost] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch donations over time
  const fetchDonationOverTime = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDonationsOverTimeService();
      setFoodPost(res.data); // Save fetched data
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch food post", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return {
    foodPost,
    loading,
    error,
    fetchDonationOverTime,
  };
};
