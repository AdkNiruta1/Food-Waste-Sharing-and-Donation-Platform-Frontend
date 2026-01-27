import { useEffect, useState } from "react";
import { getMeService } from "../services/GetProfile";

// Authentication hook to check logged-in user
export const useAuth = () => {
  // Store current user
  const [user, setUser] = useState(null);

  // Track auth loading state
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMeService();
        setUser(res.data);
      } catch {
        setUser(null); // Not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Expose auth state
  return { 
    user, 
    loading, 
    isAuthenticated: !!user 
  };
};
