import { useState, useContext } from "react";
import { getUserLogsService } from "../services/logsServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetUserLogs = () => {
  // Store user logs
  const [logs, setLogs] = useState([]);

  // Store pagination info
  const [pagination, setPagination] = useState(null);

  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for error feedback
  const { showToast } = useContext(AppContext);

  // Main function to fetch user logs with pagination
  const fetchUserLogsById = async (userId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUserLogsService(userId, page, limit);
      setLogs(res.data.logs);          // Save fetched logs
      setPagination(res.data.pagination); // Save pagination info
      return res;
    } catch (err) {
      // Handle fetch error
      setError(err.message);
      showToast(err.message || "Failed to fetch logs", "error");
      throw err;
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose data and API
  return {
    logs,
    pagination,
    loading,
    error,
    fetchUserLogsById,
  };
};
