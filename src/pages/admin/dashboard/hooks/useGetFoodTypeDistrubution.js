import { useState, useContext } from "react";
import { getFoodTypeDistributionService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFoodTypeDistrubution = () => {
  const [foodType, setFoodType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchFoodTypeDistribution = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodTypeDistributionService();
      setFoodType(res.data);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch food type", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    foodType,
    loading,
    error,
    fetchFoodTypeDistribution,
  };
};
