import { useState, useContext } from "react";
import { updateProfileService } from "../services/GetProfile";
import { AppContext } from "../context/ContextApp";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await updateProfileService(formData);
      showToast("Profile updated successfully", "success");
      return response;
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};


