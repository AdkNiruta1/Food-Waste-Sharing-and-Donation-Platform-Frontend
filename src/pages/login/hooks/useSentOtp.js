import { useState } from "react";
import { sendOtpService } from "../services/OtpServices";

export const useSentOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendOtp = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const res = await sendOtpService({ email });
      setSuccess(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading, error, success };
};
