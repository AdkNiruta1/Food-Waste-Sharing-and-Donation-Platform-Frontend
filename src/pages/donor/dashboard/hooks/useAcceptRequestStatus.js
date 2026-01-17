import { useState, useContext } from "react";
import { AcceptDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useAcceptRequestStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const acceptRequest = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AcceptDonationServices(id);
      showToast("Request accepted successfully", "success");
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to accept request", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    acceptRequest,
  };
};
