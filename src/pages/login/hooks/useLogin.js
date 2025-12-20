// React hooks
import { useState, useContext } from "react";
import { loginUserService } from "../services/LoginServices";
import { AppContext } from "../../../context/ContextApp";

/**
 * Custom hook to handle user login
 */
export const useLogin = () => {
  // State to track if login request is in progress
  const [loading, setLoading] = useState(false);

  // State to store any error message from login attempt
  const [error, setError] = useState(null);

  // Access app-wide context (e.g., toast notifications)
  const appContext = useContext(AppContext);
  const { showToast } = appContext;

  const Login = async (payload) => {
    setLoading(true); // Start loading
    setError(null);   // Clear previous errors

    try {
      // Call the login service with user credentials
      const response = await loginUserService(payload);

      // Show success toast notification
      showToast(response.message || "Login successful!", "success");

      // Return response to the caller
      return response;
    } catch (err) {
      // If login fails, store error and show toast
      setError(err.message);
      showToast(err.message || "Login failed", "error");

      // Re-throw error so calling component can handle it if needed
      throw err;
    } finally {
      // Stop loading regardless of success or error
      setLoading(false);
    }
  };

  // Return login function and state for use in components
  return { Login, loading, error };
};
