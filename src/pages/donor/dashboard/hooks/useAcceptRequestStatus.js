import { useState, useContext } from "react";
import { AcceptDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useAcceptRequestStatus = () => {
  // Track loading and error state for accepting requests
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to accept a donation request by ID
  const acceptRequest = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AcceptDonationServices(id);
      showToast("Request accepted successfully", "success");
      return res;
    } catch (err) {
      // Handle accept request error
      setError(err.message);
      showToast(err.message || "Failed to accept request", "error");
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
    acceptRequest,
  };
};
