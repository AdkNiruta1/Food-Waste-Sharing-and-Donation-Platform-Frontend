import { useState, useContext } from "react";
import { donationHistoryServices } from "../services/donationHistoryServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetDonationHistory = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchDonationHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await donationHistoryServices();
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
    fetchDonationHistory,
  };
};
