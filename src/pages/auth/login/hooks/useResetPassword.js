import { useState } from "react";
import { resetPasswordService } from "../services/resetPasswordService";
//hook to reset password
export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
//reset password function
  const resetPassword = async (email, newPassword) => {
    try {
      setLoading(true);
      setError(null);
//call service
      const res = await resetPasswordService({ email, newPassword });
      setSuccess(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
//return functions and states
  return { resetPassword, loading, error, success };
};
