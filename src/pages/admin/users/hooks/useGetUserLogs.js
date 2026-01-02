import { useState, useContext } from "react";
import { getUserLogsService } from "../services/logsServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetUserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useContext(AppContext);

  const fetchUserLogsById = async (userId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUserLogsService(userId, page, limit);
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch logs", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    pagination,
    loading,
    error,
    fetchUserLogsById,
  };
};
