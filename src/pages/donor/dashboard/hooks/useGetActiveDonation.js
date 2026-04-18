import { useState, useContext } from "react";
import { getActiveDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetActiveDonation = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { showToast } = useContext(AppContext);

  const fetchMyFoodDonation = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getActiveDonationServices(page, limit);

      // ✅ correct structure from backend
      setFoods(res.data.donations);
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