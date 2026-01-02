import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useMe";

export default function ProtectedRoute({ roles }) {
  // Get current user, loading status, and authentication state
  const { user, loading, isAuthenticated } = useAuth();

  // While auth status is loading, show a loading message
  if (loading) {
    return <div className="text-center p-10">Checking authentication...</div>;
  }
  // If user is not authenticated, redirect to home/login page
  if (!isAuthenticated || user.accountVerified !== "verified" || user.emailVerified !== "verified") {
    return <Navigate to="/" replace />;
  }

  // Role-based protection
  // If roles are specified and user's role is not allowed, redirect to home
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated (and role is allowed, if applicable), render child routes
  return <Outlet />;
}
