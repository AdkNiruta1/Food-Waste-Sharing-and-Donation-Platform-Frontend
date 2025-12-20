import { useState } from "react";
import { verifyOtpService } from "../services/OtpServices";

export const useVerifiedOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const verifyOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);

      const res = await verifyOtpService({ email, otp });
      setSuccess(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading, error, success };
};
