import { useState, useContext } from "react";
import { deleteUserService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await deleteUserService(id);
      showToast("User deleted successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
};
