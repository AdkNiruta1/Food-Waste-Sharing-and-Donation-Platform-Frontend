import { useState, useContext, useCallback } from "react";
import { getActiveListFoodRequestsService } from "../services/foodRequestServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetActiveFoodRequestList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchActiveFoodRequestList = useCallback(async (page = 1, status = "active", limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getActiveListFoodRequestsService(page, limit, status);

      if (res?.data) {
        setFoods(res.data.requests || []);
        
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }

      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch food requests";
      setError(errorMessage);
      showToast(errorMessage, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const refetch = useCallback((page = pagination.page, status = "active") => {
    return fetchActiveFoodRequestList(page, status, pagination.limit);
  }, [fetchActiveFoodRequestList, pagination.page, pagination.limit]);

  return {
    foods,
    loading,
    error,
    pagination,
    fetchActiveFoodRequestList,
    refetch,
  };
};