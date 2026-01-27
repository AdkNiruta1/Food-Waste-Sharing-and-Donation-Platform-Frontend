import { useState, useContext } from "react";
import { updateProfileService } from "../services/GetProfile";
import { AppContext } from "../context/ContextApp";

export const useUpdateProfile = () => {
  // Track profile update loading state
  const [loading, setLoading] = useState(false);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to update user profile data
  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await updateProfileService(formData);
      showToast("Profile updated successfully", "success");
      return response;
    } catch (err) {
      // Handle update error
      showToast(err.message || "Failed to update profile", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose update profile API and state
  return { updateProfile, loading };
};
