import { useState, useContext } from "react";
import { completePickupServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useCompletePickup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const completePickup = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await completePickupServices(id);
      showToast("Pickup completed successfully", "success");
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to complete pickup", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    completePickup,
  };
};
