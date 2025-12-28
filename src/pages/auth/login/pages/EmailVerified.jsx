import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { OTPInput } from "../../../../components/OTPInput";
import { useSentOtp } from "..//hooks/useSentOtp";
import { useVerifiedOtp } from "../hooks/useVerifiedOtp";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");
  const [errors, setErrors] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const { sendOtp, loading: sendLoading, error: sendError, success: sendSuccess } = useSentOtp();
  const { verifyOtp, loading: verifyLoading, error: verifyError, success: verifySuccess } = useVerifiedOtp();

  const loading = sendLoading || verifyLoading;
  const error = sendError || verifyError;
  const success = sendSuccess || verifySuccess;
  /* Redirect if email missing */
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  /* Resend timer */
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  /* Send OTP */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      await sendOtp(email);
      setStep("verify");
      setResendTimer(60);
      setResendCount((prev) => prev + 1);
    } catch (err) {
      setErrors(err.message || "Failed to send OTP");
    }
  };

  /* Verify OTP */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!otp || otp.length !== 6) {
      setErrors("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await verifyOtp(email, otp);
      setStep("success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrors(err.message || "Invalid OTP");
      setOtp("");
    }
  };

  /* Resend OTP */
  const handleResendOTP = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      await sendOtp(email);
      setOtp("");
      setResendTimer(60);
      setResendCount((prev) => prev + 1);
    } catch (err) {
      setErrors(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Annapurna Bhandar</h1>
          </div>

          {step === "success" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-sm text-muted-foreground">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {step === "send" ? "Verify Email" : "Enter OTP"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {step === "send"
                    ? `We'll send an OTP to ${email}`
                    : `Enter the 6-digit OTP sent to ${email}`}
                </p>
              </div>

              {(errors || error) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors || error}</AlertDescription>
                </Alert>
              )}

              <form
                onSubmit={step === "send" ? handleSendOTP : handleVerifyOTP}
                className="space-y-4"
              >
                {step === "verify" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      6-Digit OTP
                    </label>
                    <OTPInput value={otp} onChange={setOtp} length={6} />
                  </div>
                )}

                <Button className="w-full" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : step === "send"
                      ? "Send OTP"
                      : "Verify OTP"}
                </Button>
              </form>

              {step === "verify" && (
                <div className="mt-4 text-center text-sm">
                  <p className="text-muted-foreground">Didn't receive the code?</p>
                  {resendTimer > 0 ? (
                    <p className="mt-2">
                      Resend in{" "}
                      <span className="font-bold text-primary">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-primary font-medium mt-2"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-6 border-t pt-6 text-center text-sm">
            <Link to="/register" className="text-primary font-medium">
              Back to Registration
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
