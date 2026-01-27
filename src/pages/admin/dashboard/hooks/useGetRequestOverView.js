import { useState, useContext } from "react";
import { getRequestStatusOverviewService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetRequestOverView = () => {
  // Store request status overview data
  const [request, setRequest] = useState([]);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch request overview
  const fetchRequestOverView = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getRequestStatusOverviewService();
      setRequest(res.data); // Save fetched data
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch request overview", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return {
    request,
    loading,
    error,
    fetchRequestOverView,
  };
};
