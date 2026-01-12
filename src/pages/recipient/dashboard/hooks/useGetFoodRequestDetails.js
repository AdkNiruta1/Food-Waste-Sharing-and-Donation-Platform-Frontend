import { useState, useContext } from "react";
import {  getFoodRequestDetailsService } from "../services/foodRequestServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFoodRequestDetails = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const FoodRequestDetails = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodRequestDetailsService(id);
      setFoods(res.data);       
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch food request", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    foods,
    loading,
    error,
    FoodRequestDetails,
  };
};
