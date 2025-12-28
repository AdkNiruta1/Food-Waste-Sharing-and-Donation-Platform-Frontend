import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";

import { useNavigate } from "react-router-dom";
import {
  Leaf,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { OTPInput } from "../../../../components/OTPInput";
import { useResetPasswordSentOtp } from "../hooks/useResetPasswordSentOtp";
import { useForgetPasswordVerifiedOtp } from "../hooks/useResetPasswordVerifiedOtp";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);

  const { sendOtp, loading: sendLoading, error: sendError } = useResetPasswordSentOtp();
  const { verifyOtp, loading: verifyLoading, error: verifyError } = useForgetPasswordVerifiedOtp();
  const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();

  const loading = sendLoading || verifyLoading || resetLoading;
  const apiError = sendError || verifyError || resetError;

  /* ⏱ Resend countdown */
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  /* 1️⃣ Send OTP */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email || !email.includes("@")) {
      return setErrors({ email: "Valid email is required" });
    }

    try {
      await sendOtp(email);
      setStep("otp");
      setResendTimer(60);
    } catch {}
  };

  /* 2️⃣ Verify OTP */
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      return setErrors({ otp: "Enter a valid 6-digit OTP" });
    }

    try {
      await verifyOtp(email, otp);
      setStep("reset");
    } catch {
      setErrors({ otp: "Invalid or expired OTP" });
      setOtp("");
    }
  };

  /* 3️⃣ Reset Password */
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({});

    if (newPassword.length < 6) {
      return setErrors({ newPassword: "Minimum 6 characters required" });
    }

    if (newPassword !== confirmPassword) {
      return setErrors({ confirmPassword: "Passwords do not match" });
    }

    try {
      await resetPassword(email, newPassword);
      setStep("success");

      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setErrors({ general: "Failed to reset password" });
    }
  };

  /* 🔁 Resend OTP */
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await sendOtp(email);
      setOtp("");
      setResendTimer(60);
    } catch {
      setErrors({ otp: "Failed to resend OTP" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Annapurna Bhandar</h1>
          </div>

          {step === "success" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Password Reset Successfully
              </h2>
              <p className="text-sm text-muted-foreground">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              {(apiError || Object.keys(errors).length > 0) && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {apiError || Object.values(errors)[0]}
                  </AlertDescription>
                </Alert>
              )}

              {/* EMAIL */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              )}

              {/* OTP */}
              {step === "otp" && (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <OTPInput value={otp} onChange={setOtp} length={6} />
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <div className="text-center text-sm">
                    {resendTimer > 0 ? (
                      <p>Resend in <b>{resendTimer}s</b></p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-primary font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* RESET */}
              {step === "reset" && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              <div className="mt-6 border-t pt-6 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 text-primary"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
