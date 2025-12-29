import { useState, useContext } from "react";
import { rejectUserService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useRejectUser = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const rejectUser = async (id) => {
    setLoading(true);
    try {
      const res = await rejectUserService(id);
      showToast("User rejected successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Rejection failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { rejectUser, loading };
};
