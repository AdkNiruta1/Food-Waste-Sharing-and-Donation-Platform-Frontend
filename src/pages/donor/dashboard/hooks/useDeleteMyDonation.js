import { useState, useContext } from "react";
import { deleteDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteMyDonation = () => {
  // Track loading and error state for donation deletion
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to delete a donation by ID
  const deleteMyDonation = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDonationServices(id);
      showToast("Donation deleted successfully", "success");
    } catch (err) {
      // Handle delete donation error
      setError(err.message);
      showToast(err.message || "Failed to delete donation", "error");
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
    deleteMyDonation,
  };
};
