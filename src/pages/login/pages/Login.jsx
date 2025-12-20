import { Header } from "../../../components/Header";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Alert, AlertDescription } from "../../../components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const { Login, loading, error } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
//handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
//handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Attempt login
    try {
    const data = await Login(formData);
    //collect the status of email verified
    const emailVerified = data.data.emailVerified
    const role = data.data.role
    emailVerified ? (role === "admin" ? navigate("/admin") : role === "donor" ? navigate("/donor") : role === "recipient" ? navigate("/recipient") : navigate("/")) : navigate('/email-verification')
    } catch (err) {
      console.log("Login failed",err);
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
