import { useState, useContext } from "react";
import { donorStatsServices } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetDonorStats = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchDonorStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await donorStatsServices();
      setFoods(res.data);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch donor stats", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    foods,
    loading,
    error,
    fetchDonorStats,
  };
};
