import { useState, useContext } from "react";
import { rejectUserService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useRejectUser = () => {
  // Track rejection loading state
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to reject a user
  const rejectUser = async (id, data) => {
    setLoading(true);
    try {
      const res = await rejectUserService(id, data);
      showToast("User rejected successfully", "success");
      return res;
    } catch (err) {
      // Handle rejection error
      showToast(err.message || "Rejection failed", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose reject API and loading state
  return { rejectUser, loading };
};
