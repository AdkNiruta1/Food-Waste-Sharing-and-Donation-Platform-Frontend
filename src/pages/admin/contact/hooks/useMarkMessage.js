import { useState, useContext } from "react";
import { markMessageAsReadService } from "../services/contactServices";
import { AppContext } from "../../../../context/ContextApp";

export const useMarkMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const markMessageAsRead = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await markMessageAsReadService(id);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to mark message", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    markMessageAsRead,
  };
};
