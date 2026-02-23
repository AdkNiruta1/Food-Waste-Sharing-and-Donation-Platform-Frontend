import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { useAuth } from "../../../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useChangePassword } from "../hooks/useChangePassword";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { user: currentUser } = useAuth();

  const { changePassword, loading, error } = useChangePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!oldPassword) {
      return setErrors({ oldPassword: "Old password is required" });
    }

    if (newPassword.length < 6) {
      return setErrors({ newPassword: "Minimum 6 characters required" });
    }

    if (newPassword !== confirmPassword) {
      return setErrors({ confirmPassword: "Passwords do not match" });
    }

    try {
      await changePassword({ oldPassword, newPassword });
      setSuccess(true);
      // setTimeout(() => {
      //   const role = currentUser.role;
      //   if (role === "donor") navigate("/donor-dashboard");
      //   else if (role === "recipient") navigate("/receiver-dashboard");
      //   else navigate("/admin");
      // }, 2000);

      setTimeout(() => navigate("/profile"), 2000);
    } catch {
      setErrors({
        server:
          "Failed to change password"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Change Password</h1>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Password Updated Successfully
              </h2>
              <p className="text-sm text-muted-foreground">
                Redirecting...
              </p>
            </div>
          ) : (
            <>
              {(error || Object.keys(errors).length > 0) && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || Object.values(errors)[0]}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Old Password</Label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </form>

              <div className="mt-6 border-t pt-6 text-center">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-primary"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

