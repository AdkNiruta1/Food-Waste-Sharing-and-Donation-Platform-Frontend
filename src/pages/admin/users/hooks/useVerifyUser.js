import { useState, useContext } from "react";
import { verifyUserService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useVerifyUser = () => {
  // Track verification loading state
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to verify a user
  const verifyUser = async (id) => {
    setLoading(true);
    try {
      const res = await verifyUserService(id);
      showToast("User verified successfully", "success");
      return res;
    } catch (err) {
      // Handle verification error
      showToast(err.message || "Verification failed", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose verify API and loading state
  return { verifyUser, loading };
};
