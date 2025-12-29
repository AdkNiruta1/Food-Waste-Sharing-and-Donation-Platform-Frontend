import { useState } from "react";
import { VerifyOtpService } from "../services/resetPasswordService";
//hook to verify OTP
export const useForgetPasswordVerifiedOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
//verify OTP function
  const verifyOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
//call service
      const res = await VerifyOtpService({ email, otp });
      setSuccess(res.message);
      return res;
    } catch (err) {
      //set error message
      const message =
        err.message || "Invalid OTP";
      setError(message);
      throw new Error(message); // 🔥 important
    } finally {
      setLoading(false);
    }
  };
//return functions and states
  return { verifyOtp, loading, error, success };
};
