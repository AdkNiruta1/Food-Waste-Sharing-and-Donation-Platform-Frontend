import { useCallback, useState } from "react";
import { getAllUserService } from "../services/userServices";

export const useGetAllUsers = () => {
  // Store list of users
  const [users, setUsers] = useState([]);

  // Store pagination info
  const [pagination, setPagination] = useState({});

  // Track loading state
  const [loading, setLoading] = useState(false);

  // Main function to fetch users with optional query params
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllUserService(params);
      setUsers(res.data.users || []);        // Save fetched users
      setPagination(res.data.pagination || {}); // Save pagination info
    } finally {
      // Stop loading state
      setLoading(false);
    }
  }, []);

  // Expose data and fetch function
  return { users, pagination, loading, fetchUsers };
};
