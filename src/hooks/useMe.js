import { useEffect, useState } from "react";
import { getMeService } from "../services/GetProfile";
// authentication hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
//call getMeService to check if user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMeService();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
