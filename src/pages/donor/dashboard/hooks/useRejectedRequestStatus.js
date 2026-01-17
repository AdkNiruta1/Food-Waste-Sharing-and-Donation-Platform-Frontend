import { useState, useContext } from "react";
import { RejectDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useRejectRequestStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const rejectRequest = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await RejectDonationServices(id);
      showToast("Request rejected successfully", "success");
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to reject request", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    rejectRequest,
  };
};
