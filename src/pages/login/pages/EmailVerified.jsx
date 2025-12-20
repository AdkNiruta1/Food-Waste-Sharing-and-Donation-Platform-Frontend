import { Header } from "../../../components/Header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { OTPInput } from "../../../components/OTPInput";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep("verify");
      setResendTimer(60);
      setResendCount(resendCount + 1);
    }, 1500);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!otp || otp.length !== 6) {
      setErrors("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      if (otp === "123456") {
        setLoading(false);
        setStep("success");
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setLoading(false);
        setErrors("Invalid OTP. Please try again.");
        setOtp("");
      }
    }, 1500);
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtp("");
      setResendTimer(60);
      setResendCount(resendCount + 1);
    }, 1500);
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
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h2>
                <p className="text-sm text-muted-foreground">
                  Your email has been successfully verified. Redirecting to document verification...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {step === "send" ? "Verify Email" : "Enter OTP"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {step === "send"
                    ? `We'll send you a One-Time Password to ${email || "your email"}`
                    : `Enter the 6-digit code sent to ${email || "your email"}`}
                </p>
              </div>

              {errors && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={step === "send" ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                {step === "verify" && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">6-Digit OTP</label>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      length={6}
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : step === "send" ? "Send OTP" : "Verify OTP"}
                </Button>
              </form>

              {step === "verify" && (
                <div className="mt-4 text-center text-sm">
                  <p className="text-muted-foreground">Didn't receive the code?</p>
                  {resendTimer > 0 ? (
                    <p className="text-muted-foreground mt-2">
                      Resend in <span className="font-bold text-primary">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-primary hover:text-primary/80 font-medium mt-2 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              {resendCount > 0 && step === "verify" && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Test OTP: 123456
                </p>
              )}
            </>
          )}

          <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Back to Registration
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
