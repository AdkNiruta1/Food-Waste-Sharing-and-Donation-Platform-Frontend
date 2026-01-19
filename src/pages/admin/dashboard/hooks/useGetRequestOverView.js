import { useState, useContext } from "react";
import { getRequestStatusOverviewService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetRequestOverView = () => {
  const [request, setRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchRequestOverView = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getRequestStatusOverviewService();
      setRequest(res.data);
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch request overview", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    request,
    loading,
    error,
    fetchRequestOverView,
  };
};
