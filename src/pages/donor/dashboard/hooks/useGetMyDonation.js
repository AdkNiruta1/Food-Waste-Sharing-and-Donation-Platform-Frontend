import { useState, useContext } from "react";
import { donationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetMyFood = () => {
  // Store the list of user's food donations
  const [foods, setFoods] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch user's food donations with optional pagination
  const fetchMyFoodDonation = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await donationServices(page, limit);
      setFoods(res.data); // Save fetched food donations
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch food", "error");
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
    fetchMyFoodDonation,
  };
};
