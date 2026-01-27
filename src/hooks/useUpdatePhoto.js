import { useState, useContext } from "react";
import { updateProfilePhotoService } from "../services/GetProfile";
import { AppContext } from "../context/ContextApp";

export const useUpdatePhoto = () => {
  // Track profile photo update loading state
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to update user profile photo
  const updatePhoto = async (formData) => {
    setLoading(true);
    try {
      await updateProfilePhotoService(formData);
      showToast("Photo updated successfully", "success");
    } catch (err) {
      // Handle update error
      showToast(err.message || "Failed to update photo", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose update photo API and state
  return { updatePhoto, loading };
};
