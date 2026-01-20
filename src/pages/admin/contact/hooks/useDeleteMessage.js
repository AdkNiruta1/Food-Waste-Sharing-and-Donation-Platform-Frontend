import { useState, useContext } from "react";
import { deleteMessageService } from "../services/contactServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const deleteMessage  = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await deleteMessageService(id);
      showToast("Message deleted successfully", "success");
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
    deleteMessage,
  };
};
