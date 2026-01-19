import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/landing";
import NotFound from "../resources/NotFound";
import About from "../pages/landing/About";
import Contact from "../pages/landing/Contact";
import ProtectedRoute from "./ProtectedRoute";
import BrowseFood from "../pages/landing/Browser";
import ReciverBrowseFood from "../pages/recipient/browser/pages/BrowserFood";

import AdminDashboard from "../pages/admin/dashboard/pages/Dashboard";
import DonorDashboard from "../pages/donor/dashboard/pages/Dashboard";
import RecipientDashboard from "../pages/recipient/dashboard/pages/Dashboard";
import Login from "../pages/auth/login/pages/Login";
import VerifyEmail from "../pages/auth/login/pages/EmailVerified";
import ForgotPassword from "../pages/auth/login/pages/ForgetPassword";
import Register from "../pages/auth/Register/pages/Register";
import AdminVerifyDocuments from "../pages/admin/users/pages/AdminVeriedDoc";
import AdminVerifiedUsers from "../pages/admin/users/pages/AdminVerifiedUsers";
import { Header } from "../components/Header";
import UserProfile from "../components/UserProfile";
import Notifications from "../components/Notifications";
import ResubmitDocuments from "../components/ResubmitDocuments";
import AdminUserActivityLogs from "../pages/admin/users/pages/AdminViewUserLogs";
import CreateFood from "../pages/donor/foods/pages/CreateFood";
import FoodDetail from "../pages/recipient/browser/pages/ViewFoodDetails";
import RequestHistory from "../pages/recipient/RequestFood/pages/RequestHistory";
import ChangeEmail from "../pages/auth/change-email/pages/ChangeEmail";
import ChangePassword from "../pages/auth/change-password/pages/ChangePassword";
import DonorFoodDetail from "../pages/donor/dashboard/pages/ViewDonationFoodDetails";
import EditFood from "../pages/donor/foods/pages/EditFood";
import FoodDetailViewer from "../pages/recipient/dashboard/pages/FoodRequestDetails";
import RatingPage from "../pages/recipient/RequestFood/pages/RatingPage";
import ReceiverViewDonorDetails from "../pages/recipient/RequestFood/pages/ReceiverViewDonorDetails";
import ViewFoodRequestList from "../pages/donor/dashboard/pages/ViewFoodRequestLIst";
import DonorViewRequestDetails from "../pages/donor/dashboard/pages/DonorViewActiveDetails";
import DonationHistory from "../pages/donor/DonationHistory/pages/DonationHistory";
import ViewRecipientProfile from "../pages/donor/DonationHistory/pages/ViewRecipientProfile";
import DonorRatingPage from "../pages/donor/DonationHistory/pages/DonorRatingPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* Header always visible */}
      <Header />
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
        <Route
          path="/resubmit-documents/:token"
          element={<ResubmitDocuments />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/change-email" element={<ChangeEmail />} />
          <Route path="/change-password" element={<ChangePassword />} />


        </Route>
        {/* Admin */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-users" element={<AdminVerifiedUsers />} />
          <Route path="/admin/verify-documents" element={<AdminVerifyDocuments />} />
          <Route path="/admin/user/:userId/activity-logs" element={<AdminUserActivityLogs />} />
        </Route>

        {/* Recipient */}
        <Route element={<ProtectedRoute roles={["recipient"]} />}>
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />\
          <Route path="/food-browse" element={<ReciverBrowseFood />} />
          <Route path="/food-browse/:foodId" element={<FoodDetail />} />
          <Route path="/request-history" element={<RequestHistory />} />
          <Route path="/food-donations/details/:foodId" element={<FoodDetailViewer />} />
          <Route path="/food-donations/rating/:foodId" element={<RatingPage />} />
          <Route path="/food-donations/donor/:id" element={<ReceiverViewDonorDetails />} />


        </Route>

        {/* Donor */}
        <Route element={<ProtectedRoute roles={["donor"]} />}>
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/create-food" element={<CreateFood />} />
          <Route path="/food-details/:foodId" element={<DonorFoodDetail />} />
          <Route path="/update-food/:foodId" element={<EditFood />} />
          <Route path="/donor/food/:foodId/requests" element={<ViewFoodRequestList />} />
          <Route path="/donor/food/active/details/:id" element={<DonorViewRequestDetails />} />
          <Route path="/donation-history" element={<DonationHistory />} />
          <Route path="/donation-history/recipient/:id" element={<ViewRecipientProfile />} />
          <Route path="/donation-history/recipient/rating/:foodId" element={<DonorRatingPage />} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
