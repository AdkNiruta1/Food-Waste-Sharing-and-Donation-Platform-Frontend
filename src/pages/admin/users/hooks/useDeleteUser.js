import { useState, useContext } from "react";
import { deleteUserService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteUser = () => {
  // Track deletion loading state
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to delete a user by ID
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await deleteUserService(id);
      showToast("User deleted successfully", "success");
      return res;
    } catch (err) {
      // Handle delete error
      showToast(err.message || "Delete failed", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose delete API and loading state
  return { deleteUser, loading };
};
