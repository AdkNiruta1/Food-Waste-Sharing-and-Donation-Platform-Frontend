import { useState, useContext } from "react";
import {  getFoodDetailsService } from "../services/foodDonationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFoodDetails = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const FoodDonationDeatils = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodDetailsService(id);
      setFoods(res.data);       
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
    FoodDonationDeatils,
  };
};
