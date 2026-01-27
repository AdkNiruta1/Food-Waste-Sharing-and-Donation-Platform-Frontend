import { useState, useContext } from "react";
import { getFoodPostsService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetFoodPost = () => {
  // Store food posts data
  const [foodPost, setFoodPost] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch food posts
  const fetchFoodPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getFoodPostsService();
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
    fetchFoodPost,
  };
};
