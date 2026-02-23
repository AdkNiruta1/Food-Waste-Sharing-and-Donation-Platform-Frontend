import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { OTPInput } from "../../../../components/OTPInput";
import { useSentOtp } from "../hooks/useSentOtp";
import { useVerifiedOtp } from "../hooks/useVerifiedOtp";
import { useAuth } from "../../../../context/AuthContext";

export default function ChangeEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send"); // send | verify | success
  const [errors, setErrors] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const { sendOtp, loading: sendLoading, error: sendError } = useSentOtp();
  const { verifyOtp, loading: verifyLoading, error: verifyError } = useVerifiedOtp();

  const loading = sendLoading || verifyLoading;
  const error = sendError || verifyError;
  const { user: currentUser } = useAuth();


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

    if (!email) {
      setErrors("Email is required");
      return;
    }

    try {
      await sendOtp(email);
      setStep("verify");
      setResendTimer(60);
    } catch (err) {
      setErrors(err.message || "Failed to send OTP");
    }
  };

  /* Verify OTP */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors("");

    if (otp.length !== 6) {
      setErrors("Enter a valid 6-digit OTP");
      return;
    }

    try {
      await verifyOtp(email, otp);
      setStep("success");

      // 🔥 Redirect by role
      setTimeout(() => {
        const role = currentUser.role;
        if (role === "donor") navigate("/donor-dashboard");
        else if (role === "recipient") navigate("/receiver-dashboard");
        else navigate("/admin");
      }, 1500);
    } catch (err) {
      setErrors(err.message || "Invalid OTP");
      setOtp("");
    }
  };

  /* Resend OTP */
  const handleResendOTP = async () => {
    setErrors("");
    await sendOtp(email);
    setOtp("");
    setResendTimer(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Annapurna Bhandar</h1>
        </div>

        {step === "success" ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>

              <h2 className="text-xl font-bold mb-2">
                {step === "send" ? "Change Your Email" : "Enter OTP"}
              </h2>

              <p className="text-sm text-muted-foreground">
                {step === "send"
                  ? "Enter your email to receive an OTP"
                  : `Enter the OTP sent to ${email}`}
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
              {step === "send" && (
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              )}

              {step === "verify" && (
                <OTPInput value={otp} onChange={setOtp} length={6} />
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
                {resendTimer > 0 ? (
                  <p>Resend OTP in <b>{resendTimer}s</b></p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-primary font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-6 border-t pt-6 text-center text-sm cursor-pointer">
          <Link to="/profile" className="text-primary font-medium">
            Back to profile
          </Link>
        </div>
      </Card>
    </div>
  );
}
