import { useState, useContext } from "react";
import { verifyUserService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useVerifyUser = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const verifyUser = async (id) => {
    setLoading(true);
    try {
      const res = await verifyUserService(id);
      showToast("User verified successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Verification failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyUser, loading };
};
