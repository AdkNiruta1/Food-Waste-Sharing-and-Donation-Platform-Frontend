import { useState, useContext } from "react";
import { AppContext } from "../../../../context/ContextApp";
import { submitRating } from "../services/ratingServices";

export const useCreateRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const createRating = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await submitRating(data);
      showToast("Rating submitted successfully", "success");
      return res;

    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to submit rating", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRating,
    loading,
    error,
  };
};
