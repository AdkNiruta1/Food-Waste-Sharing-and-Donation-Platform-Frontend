import { useState } from "react";
import { sendOtpService } from "../services/otpServices";
//hook to send OTP
export const useSentOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
//send OTP function
  const sendOtp = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
//call service
      const res = await sendOtpService({ email });
      //set success message
      setSuccess(res.message);
      return res;
    } catch (err) {
      //set error message
      const message =
        err.message || "Failed to send OTP";
      setError(message);
      throw new Error(message); // 🔥 important
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading, error, success };
};
