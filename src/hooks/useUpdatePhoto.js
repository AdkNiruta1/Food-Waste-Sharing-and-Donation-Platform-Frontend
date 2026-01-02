import { useState, useContext } from "react";
import { updateProfilePhotoService } from "../services/GetProfile";
import { AppContext } from "../context/ContextApp";

export const useUpdatePhoto = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const updatePhoto = async (formData) => {
    setLoading(true);
    try {
      await updateProfilePhotoService(formData);
      showToast("Photo updated successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to update photo", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePhoto, loading };
};


