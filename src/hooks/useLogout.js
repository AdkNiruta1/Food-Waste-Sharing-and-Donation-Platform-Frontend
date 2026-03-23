import { useState } from "react";
import { LogoutService } from "../services/LogoutService";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await LogoutService();
      setMessage(res.message || "Logged out successfully");
      return res;
    } catch (err) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, message, error };
};
