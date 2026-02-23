import { useState, useContext } from "react";
import { getDonationsOverTimeService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetDonationOverTime = () => {
  const [foodPost, setFoodPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchDonationOverTime = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDonationsOverTimeService();
      setFoodPost(res.data);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch food post", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    foodPost,
    loading,
    error,
    fetchDonationOverTime,
  };
};
