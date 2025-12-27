import { useState } from "react";
import { verifyOtpService } from "../services/OtpServices";
//hook to verify OTP
export const useVerifiedOtp = () => {
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
      const res = await verifyOtpService({ email, otp });
      setSuccess(res.message);
      return res;
    } catch (err) {
      //set error message
      console.log(err);
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
