import { Header } from "../../../components/Header";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { OTPInput } from "../../../components/OTPInput";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim() || !email.includes("@")) {
      newErrors.email = "Valid email is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        setStep("otp");
        setResendTimer(60);
      }, 1500);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const newErrors= {};

    if (!otp || otp.length !== 6) {
      newErrors.otp = "Please enter a valid 6-digit OTP";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Simulate OTP verification
      setTimeout(() => {
        if (otp === "123456") {
          setLoading(false);
          setStep("reset");
        } else {
          setLoading(false);
          setErrors({ otp: "Invalid OTP. Please try again." });
          setOtp("");
        }
      }, 1500);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Simulate password reset
      setTimeout(() => {
        setLoading(false);
        setStep("success");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }, 1500);
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    setResendTimer(60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">FoodShare</h1>
          </div>

          {step === "success" ? (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Password Reset Successfully!
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Your password has been reset. You can now login with your new password.
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to login page...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                {step === "email" && (
                  <>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Reset Your Password
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your email address and we'll send you a code to reset your password.
                    </p>
                  </>
                )}
                {step === "otp" && (
                  <>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Enter OTP Code
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We've sent a 6-digit code to {email}
                    </p>
                  </>
                )}
                {step === "reset" && (
                  <>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Set New Password
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Create a strong password for your account
                    </p>
                  </>
                )}
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {Object.values(errors)[0]}
                  </AlertDescription>
                </Alert>
              )}

              {/* Step 1: Email */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className="h-10"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending Code..." : "Send Code"}
                  </Button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      6-Digit OTP
                    </label>
                    <OTPInput value={otp} onChange={setOtp} length={6} />
                    {errors.otp && (
                      <p className="text-xs text-destructive">{errors.otp}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>

                  <div className="text-center text-sm">
                    <p className="text-muted-foreground mb-2">
                      Didn't receive the code?
                    </p>
                    {resendTimer > 0 ? (
                      <p className="text-muted-foreground">
                        Resend in <span className="font-bold text-primary">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Test OTP: 123456
                  </p>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {step === "reset" && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword)
                          setErrors({ ...errors, newPassword: "" });
                      }}
                      className="h-10"
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-destructive">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: "" });
                      }}
                      className="h-10"
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="bg-accent/10 border border-accent rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      <strong>Password requirements:</strong>
                      <br />
                      • At least 6 characters
                      <br />
                      • Mix of uppercase and lowercase
                      <br />
                      • Include numbers or special characters
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              {/* Back Button */}
              {step !== "success" && (
                <div className="mt-6 border-t border-border pt-6 text-center">
                  <button
                    onClick={() => {
                      if (step === "otp") {
                        setStep("email");
                        setOtp("");
                        setErrors({});
                      } else if (step === "reset") {
                        setStep("otp");
                        setNewPassword("");
                        setConfirmPassword("");
                        setErrors({});
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {step === "email" ? "Back to Login" : "Back"}
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
