import { useState, useContext } from "react";
import { getUserByIdService } from "../services/userServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetUserById = () => {
  // Store user data
  const [user, setUser] = useState(null);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch a single user by ID
  const fetchUserById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUserByIdService(id);
      setUser(res.data); // Save fetched user data
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch user", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return { user, loading, error, fetchUserById };
};
