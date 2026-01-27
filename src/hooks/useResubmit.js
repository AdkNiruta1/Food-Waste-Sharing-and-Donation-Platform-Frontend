import { useState, useContext } from "react";
import { ResubmitServices } from "../services/resubmitServices";
import { AppContext } from "../context/ContextApp";

export const useResubmit = () => {
  // Track resubmission loading state
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to resubmit user data
  const resubmitUser = async (data, token) => {
    setLoading(true);
    try {
      const res = await ResubmitServices(data, token);
      showToast("User resubmitted successfully", "success");
      return res;
    } catch (err) {
      // Handle resubmission error
      showToast(err.message || "Resubmission failed", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose resubmission API and state
  return { resubmitUser, loading };
};
