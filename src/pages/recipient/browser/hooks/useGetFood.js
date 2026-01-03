import { useState, useContext } from "react";
import { FoodServices } from "../services/foodDonationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFood = () => {
  const [foods, setFoods] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const fetchFoodDonation = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await FoodServices(page, limit);

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
    pagination,
    loading,
    error,
    fetchFoodDonation,
  };
};
