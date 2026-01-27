import { useState, useContext } from "react";
import { getFoodPostByIdService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFoodPostById = () => {
  // Store food post data
  const [foodPost, setFoodPost] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch a single food post by ID
  const fetchFoodPostById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodPostByIdService(id);
      setFoodPost(res.data); // Save fetched data
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch food post", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return {
    foodPost,
    loading,
    error,
    fetchFoodPostById,
  };
};
