// React hooks
import { useState, useContext } from "react";
// App-level context for global state (like toast notifications)
import { AppContext } from "../../../context/ContextApp";
// Service that handles registration API call
import { registerService } from "../services/registerService";

/**
 * Custom hook to handle user registration
 */
export const useRegister = () => {
  // State to track if registration request is in progress
  const [loading, setLoading] = useState(false);

  // State to store any error message from registration attempt
  const [error, setError] = useState(null);

  // Access app-wide context (e.g., toast notifications)
  const appContext = useContext(AppContext);
  const { showToast } = appContext;
  
  const register = async (payload) => {
    setLoading(true); // Start loading
    setError(null);   // Clear previous errors

    try {
      // Call the registration service with user data
      const response = await registerService(payload);

      // Show success toast notification
      showToast(response.message || "Registration successful!", "success");

      // Return response to the caller
      return response;
    } catch (err) {
      // If registration fails, store error and show toast
      setError(err.message);
      showToast(err.message || "Registration failed", "error");

      // Re-throw error so calling component can handle it if needed
      throw err;
    } finally {
      // Stop loading regardless of success or error
      setLoading(false);
    }
  };

  // Return registration function and state for use in components
  return { register, loading, error };
};
