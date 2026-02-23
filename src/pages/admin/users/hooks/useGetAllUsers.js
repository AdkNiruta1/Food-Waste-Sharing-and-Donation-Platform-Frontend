import { useCallback, useState } from "react";
import { getAllUserService } from "../services/userServices";

export const useGetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllUserService(params);
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || {});
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, pagination, loading, fetchUsers };
};
