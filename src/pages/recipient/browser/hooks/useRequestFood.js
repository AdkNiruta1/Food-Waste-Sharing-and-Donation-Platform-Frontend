import { useState, useContext } from "react";
import { requestFoodService } from "../services/foodDonationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useRequestFood = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const requestFood = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await requestFoodService(data);
      showToast("Food request submitted successfully", "success");
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch food", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    requestFood,
  };
};
