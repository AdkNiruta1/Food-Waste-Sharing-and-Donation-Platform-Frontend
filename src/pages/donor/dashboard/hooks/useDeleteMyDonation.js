import { useState, useContext } from "react";
import { deleteDonationServices } from "../services/donationServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteMyDonation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const deleteMyDonation = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDonationServices(id);
      showToast("Donation deleted successfully", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to delete donation", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deleteMyDonation,
  };
};
