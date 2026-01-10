import { useContext, useState } from "react";
import { changePasswordService } from "../services/changePasswordServices";
import { AppContext } from "../../../../context/ContextApp";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const changePassword = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await changePasswordService(data);
      showToast("Password has Sucessful changed", "success");

    } catch (err) {
      setError(err.message || "Failed to change password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
};
