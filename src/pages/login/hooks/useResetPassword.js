import { useState } from "react";
import { resetPasswordService } from "../services/ResetPasswordService";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const resetPassword = async (email, newPassword) => {
    try {
      setLoading(true);
      setError(null);

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

  return { resetPassword, loading, error, success };
};
