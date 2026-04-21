import { useState, useContext } from "react";
import { getActiveDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetActiveDonation = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchMyFoodDonation = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getActiveDonationServices();
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
    fetchMyFoodDonation,
  };
};