import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { AppContext } from "../../../../context/ContextApp";
import { useContext } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { Login, loading, error: loginError } = useLogin();
  const [error, setError] = useState(null);
  const appContext = useContext(AppContext);
  const { showToast } = appContext;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const displayError = error || loginError;

  //handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the Login function from useLogin hook
      const data = await Login(formData);
      const userVerified = data.data.status;
      // Extract emailVerified and role from response
      const emailVerified = data.data.emailVerified;
      const role = data.data.role;
      // Extract email from response or fallback to form data
      const email = data.data.email || formData.email;
// Navigate based on verification status and role
      if (emailVerified) {
        if (userVerified) {
          // Navigate based on user role and show appropriate toast
          if (role === "admin") {
            navigate("/admin");
            showToast("Admin login successful.", "success");

          }
          // Navigate based on user role and show appropriate toast
          else if (role === "donor") {
            navigate("/donor-dashboard");
            showToast("Donor login successful.", "success");
          }
          else if (role === "recipient") {
            navigate("/recipient-dashboard");
            showToast("Recipient login successful.", "success");
          }
          else navigate("/");
        }
        // User not verified by admin
        else {
          showToast("User not verified by admin yet.", "error");
          setError("User not verified by admin yet.");
        }
        // Email not verified
      } else {
        showToast("Please verify your email address.", "error");
        navigate("/email-verification", {
          state: { email },
        });
      }
    } catch (err) {
      console.log("Login failed", err);
    }
  };


  return (
    // Page layout
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Annapurna Bhandar
            </h1>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            Sign In
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Welcome back! Please sign in to your account.
          </p>

          {/* ❌ Error */}
          {displayError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>


            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
