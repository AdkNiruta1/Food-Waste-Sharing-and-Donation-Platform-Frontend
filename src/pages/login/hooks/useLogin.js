import { useState } from "react";
import { loginUserService } from "../services/loginServices";
import { AppContext } from "../../../context/ContextApp";
import { useContext } from "react";
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const appContext = useContext(AppContext);
  const { showToast } = appContext;
  const Login = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUserService(payload);
      showToast(response.message || "Login successful!", "success");

      return response;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Login failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { Login, loading, error };
};
