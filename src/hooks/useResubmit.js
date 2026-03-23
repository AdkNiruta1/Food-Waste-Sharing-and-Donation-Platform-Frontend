
import { useState, useContext } from "react";
import { ResubmitServices } from "../services/ResubmitServices";
import { AppContext } from "../context/ContextApp";

export const useResubmit = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const resubmitUser = async (data, token) => {
    setLoading(true);
    try {
      const res = await ResubmitServices(data, token);
      showToast("User resubmitted successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Resubmission failed", "error");
      throw err;
    } finally {

      setLoading(false);
    }
  };

  return { resubmitUser, loading };
};
