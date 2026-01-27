import { useState } from "react";
import { LogoutService } from "../services/logoutService";

export const useLogout = () => {
  // Track logout request state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Main function to log out user
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await LogoutService();
      setMessage(res.message || "Logged out successfully");
      return res;
    } catch (err) {
      // Handle logout error
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Expose logout API and states
  return { logout, loading, message, error };
};
