import { useState, useContext } from "react";
import { donationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetMyFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { showToast } = useContext(AppContext);

  const fetchMyFoodDonation = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await donationServices(page, 10);

      // ✅ set data
      setFoods(res.data.donations);

      // ✅ set pagination from backend
      setPagination(res.data.pagination);

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
    foods,
    loading,
    error,
    pagination, // ✅ expose pagination
    fetchMyFoodDonation,
  };
};