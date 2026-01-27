import { useState, useContext } from "react";
import { getMyLogsService } from "../pages/admin/users/services/logsServices";
import { AppContext } from "../context/ContextApp";

export const useGetMyLogs = () => {
  // Store logs data
  const [logs, setLogs] = useState([]);

  // Store pagination info
  const [pagination, setPagination] = useState(null);

  // Handle loading state for API call
  const [loading, setLoading] = useState(false);

  // Store error message
  const [error, setError] = useState(null);

  // Global toast for showing errors
  const { showToast } = useContext(AppContext);

  // Main function to fetch user logs (supports pagination / infinite scroll)
  const fetchMyLogs = async (page = 1, limit = 10) => {
    // Prevent duplicate API calls while loading
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getMyLogsService(page, limit);

      // Reset logs on first page, append on next pages
      setLogs((prev) =>
        page === 1
          ? res.data.logs               // First page (refresh)
          : [...prev, ...res.data.logs] // Next pages (load more)
      );

      // Save pagination metadata
      setPagination(res.data.pagination);

      return res;
    } catch (err) {
      // Handle and show error
      setError(err.message);
      showToast(err.message || "Failed to fetch logs", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  return {
    logs,         // Logs list
    pagination,   // Pagination info
    loading,      // Loading state
    error,        // Error message
    fetchMyLogs,  // Function to fetch logs
  };
};
