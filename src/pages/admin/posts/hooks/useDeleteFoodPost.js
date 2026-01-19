import { useState, useContext, useCallback } from "react";
import { getFoodPostServices } from "../services/postServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteFoodPost = () => {
  const [foods, setFoods] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const fetchFoodPost = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodPostServices(params);
      setFoods(res.data.foodPosts || []);
      setPagination(res.data.pagination);
      return res;
    } catch (err) {
      const message = err?.message || "Failed to fetch food post";
      setError(message);
      showToast(message, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]); // include showToast as dependency

  return {
    foods,
    pagination,
    loading,
    error,
    fetchFoodPost,
  };
};
