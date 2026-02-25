import { useState, useContext } from "react";
import { getDonationHistoryByIdServices } from "../services/donationHistoryServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetDonationHistoryById = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchDonationHistoryById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDonationHistoryByIdServices(id);
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
    fetchDonationHistoryById,
  };
};
