import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/landing";
import Login from "../pages/login/pages/Login";
import Register from "../pages/Register/pages/Register";
import NotFound from "../resources/NotFound";
import About from "../pages/landing/About";
import Contact from "../pages/landing/Contact";
import ProtectedRoute from "./ProtectedRoute";
import VerifyEmail from "../pages/login/pages/EmailVerified";
import ForgotPassword from "../pages/login/pages/ForgetPassword";

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




        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> */}

        {/* Role-based Protected */}
        {/* <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
