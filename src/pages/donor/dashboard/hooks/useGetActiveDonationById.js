import { useState, useContext } from "react";
import { getActiveDonationsbyIdServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetActiveDonationById = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchMyActiveDonationById = async (donationId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getActiveDonationsbyIdServices(donationId);
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
    fetchMyActiveDonationById,
  };
};
