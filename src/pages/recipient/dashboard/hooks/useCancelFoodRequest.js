import { useState, useContext } from "react";
import { cancelFoodRequestService  } from "../services/foodRequestServices";
import { AppContext } from "../../../../context/ContextApp";

export const useCancelFoodRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const cancelFoodRequest = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await cancelFoodRequestService(id);
      showToast("Food request cancelled successfully", "success");
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
    cancelFoodRequest,
    loading,
    error,
  };
};
