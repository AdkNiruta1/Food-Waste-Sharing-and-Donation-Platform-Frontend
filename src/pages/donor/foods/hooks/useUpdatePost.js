import { useState, useContext } from "react";
import { editFoodServices } from "../services/foodServices";
import { AppContext } from "../../../../context/ContextApp";

export const useUpdatePost = () => {
  // Track loading state for updating a food post
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to update a food post by ID
  const updatePost = async (data, id) => {
    setLoading(true);
    try {
      const res = await editFoodServices(data, id);
      showToast("Post updated successfully", "success");
      return res;
    } catch (err) {
      // Handle update error
      showToast(err.message || "update failed", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose API and loading state
  return { updatePost, loading };
};
