import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useMe";

export default function ProtectedRoute({ roles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role-based protection
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
