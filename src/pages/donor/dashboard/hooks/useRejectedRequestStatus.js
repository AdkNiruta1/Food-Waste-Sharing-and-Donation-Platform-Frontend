import { useState, useContext } from "react";
import { RejectDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useRejectRequestStatus = () => {
  // Track loading and error state for rejecting requests
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to reject a donation request by ID
  const rejectRequest = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await RejectDonationServices(id);
      showToast("Request rejected successfully", "success");
      return res;
    } catch (err) {
      // Handle reject request error
      setError(err.message);
      showToast(err.message || "Failed to reject request", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose API and state
  return {
    loading,
    error,
    rejectRequest,
  };
};
