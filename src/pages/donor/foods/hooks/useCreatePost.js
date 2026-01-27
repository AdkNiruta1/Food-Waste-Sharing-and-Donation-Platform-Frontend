import { useState, useContext } from "react";
import { createFoodServices } from "../services/foodServices";
import { AppContext } from "../../../../context/ContextApp";

export const useCreatePost = () => {
  // Track loading state for creating a food post
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to create a food post
  const createPost = async (data) => {
    setLoading(true);
    try {
      const res = await createFoodServices(data);
      showToast("Post created successfully", "success");
      return res;
    } catch (err) {
      // Handle creation error
      showToast(err.message || "creation failed", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose API and loading state
  return { createPost, loading };
};
