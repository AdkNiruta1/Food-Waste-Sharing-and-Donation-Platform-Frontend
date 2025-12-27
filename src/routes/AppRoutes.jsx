import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/landing";
import NotFound from "../resources/NotFound";
import About from "../pages/landing/About";
import Contact from "../pages/landing/Contact";
import ProtectedRoute from "./ProtectedRoute";
import BrowseFood from "../pages/landing/Browser";
import AdminDashboard from "../pages/admin/dashboard/pages/Dashboard";
import DonorDashboard from "../pages/donor/dashboard/pages/Dashboard";
import RecipientDashboard from "../pages/recipient/dashboard/pages/Dashboard";
import Login from "../pages/auth/login/pages/Login";
import VerifyEmail from "../pages/auth/login/pages/EmailVerified";
import ForgotPassword from "../pages/auth/login/pages/ForgetPassword";
import Register from "../pages/auth/Register/pages/Register";
import AdminVerifyDocuments from "../pages/admin/users/pages/AdminVeriedDoc";
import AdminVerifiedUsers from "../pages/admin/users/pages/AdminVerifiedUsers";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/email-verification" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/browse" element={<BrowseFood />} />
        {/* Role-based Protected */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-users" element={<AdminVerifiedUsers />} />
          <Route path="/admin/verify-documents" element={<AdminVerifyDocuments />} />



        </Route>
        <Route element={<ProtectedRoute roles={["recipient"]} />}>
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
        </Route>
        <Route element={<ProtectedRoute roles={["donor"]} />}>
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
