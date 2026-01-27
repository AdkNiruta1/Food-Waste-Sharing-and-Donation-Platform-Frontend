import { createContext, useContext, useEffect, useState } from "react";
import { getMeService } from "../services/GetProfile";

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Store logged-in user
  const [user, setUser] = useState(null);

  // Track loading state
  const [loading, setLoading] = useState(true);

  // Fetch current user from API
  const fetchUser = async () => {
    try {
      const res = await getMeService();
      setUser(res.data); // Set user data
    } catch {
      setUser(null); // If error, clear user
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Run once on app load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,                    // Current user
        loading,                 // Loading state
        isAuthenticated: !!user, // True if logged in
        refetchUser: fetchUser,  // Manually refetch user
        setUser,                 // Update user manually
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
