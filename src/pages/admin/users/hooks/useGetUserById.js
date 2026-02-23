import { useState, useContext } from "react";
import { getUserByIdService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetUserById = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const fetchUserById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUserByIdService(id);
      setUser(res.data);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch user", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, fetchUserById };
};
