import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, Star, MapPin, User, Mail, Phone, Shield, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

import { useVerifyUser } from "../hooks/useVerifyUser";
import { useRejectUser } from "../hooks/useRejectUser";
import { IMAGE_URL } from "../../../../constants/constants";
import { useDeleteUser } from "../hooks/useDeleteUser";

export default function AdminVerifyDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state?.user;

  const { verifyUser, loading: verifyLoading } = useVerifyUser();
  const { rejectUser, loading: rejectLoading } = useRejectUser();
  const { deleteUser, loading:deleteLoading } = useDeleteUser();
  const [decision, setDecision] = useState("approve");
  const [rejectionReason, setRejectionReason] = useState("");
  const [step, setStep] = useState("pending");
  const [activeTab, setActiveTab] = useState("documents");

  const loading = verifyLoading || rejectLoading;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 shadow-lg">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700">No user data provided</p>
          <Button
            onClick={() => navigate("/manage-users")}
            className="mt-4 bg-linear-to-r from-emerald-500 to-emerald-600"
          >
            Return to Users
          </Button>
        </Card>
      </div>
    );
  }

  const DOCUMENTS = [
    { key: "citizenshipFront", label: "Citizenship Front", icon: "📄" },
    { key: "citizenshipBack", label: "Citizenship Back", icon: "📄" },

    { key: "pan", label: "PAN Card", icon: "💳" },
    { key: "drivingLicense", label: "Driving License", icon: "🚗" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (decision === "reject" && !rejectionReason.trim()) return;

    try {
      if (decision === "approve") {
        await verifyUser(userData.id);
        setStep("approved");
      } else {
        await rejectUser(userData.id, { reason: rejectionReason });
        setStep("rejected");
      }

      // Redirect after success UI
      setTimeout(() => {
        navigate("/manage-users");
      }, 2000);
    } catch {
      // errors handled inside hooks (toast)
    }
  };

  const handleDelete = async (id) => {
      await deleteUser(id);
      navigate("/manage-users");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "donor": return "bg-blue-100 text-blue-800 border-blue-200";
      case "recipient": return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100/80">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {userData.status === "pending" ? "Document Verification" : "User Details"}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {userData.status === "pending"
                    ? "Review and verify user documents"
                    : "View complete user profile"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/manage-users")}
              className="border-slate-300 hover:border-slate-400"
            >
              Back to Users
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto max-w-6xl px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1">
            <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                    {userData.profilePicture ? (
                      <img
                        src={`${IMAGE_URL}${userData.profilePicture}`}
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <Badge className={`absolute bottom-2 right-2 ${getStatusColor(userData.status)}`}>
                    {userData.status.toUpperCase()}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{userData.name}</h2>
                <Badge className={`mt-2 ${getRoleColor(userData.role)}`}>
                  {userData.role.toUpperCase()}
                </Badge>

                {/* Rating Display */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= (userData.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {userData.rating || "0.0"} ({userData.ratingCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50/80">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm font-medium text-slate-900">
                          {userData.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="text-sm font-medium text-slate-900">
                          {userData?.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Joined</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(userData?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {userData.bio && (
                  <div className="p-4 rounded-xl bg-slate-50/80">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      Bio
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {userData.bio}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
              {/* Success/Rejection Messages */}
              {step === "approved" && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                    <CheckCircle className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Account Approved!
                  </h2>
                  <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    {userData.name}'s account has been successfully verified and activated.
                  </p>
                  <div className="animate-pulse">
                    <p className="text-sm text-slate-500">
                      Returning to pending list...
                    </p>
                  </div>
                </div>
              )}

              {step === "rejected" && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-linear-to-br from-rose-100 to-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/20">
                    <XCircle className="h-12 w-12 text-rose-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Application Rejected
                  </h2>
                  <p className="text-lg text-slate-600 mb-8">
                    User has been notified about the rejection.
                  </p>
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-6 mb-8 text-left max-w-lg mx-auto">
                    <p className="font-semibold text-slate-800 mb-2">Rejection Reason:</p>
                    <p className="text-slate-700">{rejectionReason}</p>
                  </div>
                  <div className="animate-pulse">
                    <p className="text-sm text-slate-500">
                      Returning to pending list...
                    </p>
                  </div>
                </div>
              )}

              {/* Main Content - Pending */}
              {step === "pending" && (
                <>
                  <div className="flex flex-col items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {userData.status === "pending" ? "Verify Documents" : "User Profile"}
                      </h2>
                      <p className="text-slate-600 mt-2">
                        {userData.status === "pending"
                          ? "Review all submitted documents carefully"
                          : "View user information and history"}
                      </p>
                    </div>
                    {userData.status === "pending" && (
                      <Alert className="border-amber-200/80 bg-linear-to-br from-amber-50 to-amber-100/50">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <AlertDescription className="text-amber-800 font-medium">
                          Verify all documents before approving access
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Tabs for Better Organization */}
                  <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 p-1 rounded-xl">
                      <TabsTrigger
                        value="documents"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger
                        value="info"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Additional Info
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="mt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {DOCUMENTS.map(({ key, label, icon }) => {
                          const file = userData.documents?.[key];
                          if (!file) return null;
                          const isPdf = file.endsWith(".pdf");

                          return (
                            <Card
                              key={key}
                              className="p-6 border-slate-200/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{icon}</span>
                                    <h3 className="font-semibold text-slate-900">{label}</h3>
                                  </div>
                                  <p className="text-sm text-slate-500">
                                    {isPdf ? "PDF Document" : "Image Document"}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`${IMAGE_URL}${file}`, "_blank")}
                                  className="border-slate-300 hover:border-slate-400"
                                >
                                  View
                                </Button>
                              </div>

                              {!isPdf && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                                  <img
                                    src={`${IMAGE_URL}${file}`}
                                    alt={label}
                                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>

                      {/* No documents fallback */}
                      {!DOCUMENTS.some(d => userData.documents?.[d.key]) && (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-10 w-10 text-slate-400" />
                          </div>
                          <p className="text-lg text-slate-700">No documents submitted</p>
                          <p className="text-sm text-slate-500 mt-2">
                            User hasn't uploaded any verification documents
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="info" className="mt-6">
                      <div className="space-y-6">
                        {/* Additional Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 rounded-xl bg-blue-50/80 border border-blue-200">
                            <p className="text-sm text-blue-600 font-semibold">ACCOUNT AGE</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                              {Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                          <div className="p-5 rounded-xl bg-purple-50/80 border border-purple-200">
                            <p className="text-sm text-purple-600 font-semibold">LAST ACTIVITY</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                              {new Date(userData.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Additional Notes Section */}
                        <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200">
                          <h3 className="font-semibold text-slate-900 mb-3">Verification Notes</h3>
                          <p className="text-sm text-slate-600">
                            Review all documents for authenticity. Check for clear visibility,
                            valid dates, and matching information with user profile.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Decision Section (Only for pending users) */}
                  {userData.status === "pending" && (
                    <form onSubmit={handleSubmit} className="space-y-8 mt-10 pt-8 border-t border-slate-200/80">
                      <div className="grid md:grid-cols-2 gap-6">
                        <label
                          className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${decision === "approve"
                              ? "border-emerald-500 bg-linear-to-br from-emerald-50 to-emerald-100/50 shadow-lg shadow-emerald-500/10"
                              : "border-slate-300 hover:border-slate-400 hover:shadow-md"
                            }`}
                        >
                          <input
                            type="radio"
                            checked={decision === "approve"}
                            onChange={() => setDecision("approve")}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                              <CheckCircle className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Approve Account</h3>
                            <p className="text-sm text-slate-600 text-center">
                              User meets all requirements
                            </p>
                          </div>
                        </label>

                        <label
                          className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${decision === "reject"
                              ? "border-rose-500 bg-linear-to-br from-rose-50 to-rose-100/50 shadow-lg shadow-rose-500/10"
                              : "border-slate-300 hover:border-slate-400 hover:shadow-md"
                            }`}
                        >
                          <input
                            type="radio"
                            checked={decision === "reject"}
                            onChange={() => setDecision("reject")}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                              <XCircle className="h-8 w-8 text-rose-600" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Reject Application</h3>
                            <p className="text-sm text-slate-600 text-center">
                              Documents are insufficient
                            </p>
                          </div>
                        </label>
                      </div>

                      {decision === "reject" && (
                        <div className="space-y-4">
                          <label className="block">
                            <span className="font-medium text-slate-900">Rejection Reason *</span>
                            <p className="text-sm text-slate-500 mb-2">
                              Provide clear reason for rejection
                            </p>
                            <Textarea
                              placeholder="Example: Citizenship document is blurry and not clearly visible..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              rows={4}
                              className="rounded-xl border-slate-300 focus:border-rose-400 focus:ring-rose-400/20"
                              required
                            />
                          </label>
                        </div>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading || (decision === "reject" && !rejectionReason)}
                        className={`w-full h-14 rounded-xl font-bold text-lg ${decision === "approve"
                            ? "bg-linear-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
                            : "bg-linear-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20"
                          }`}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Processing...
                          </div>
                        ) : decision === "approve" ? (
                          "Approve Account"
                        ) : (
                          "Send Rejection"
                        )}
                      </Button>
                    </form>
                  )}

                  {/* View Only Mode for Approved/Rejected Users */}
                  {(userData.status === "approved" || userData.status === "rejected") && (
                    <div className="mt-10 pt-8 border-t border-slate-200/80">
                      <div className="p-6 rounded-2xl bg-slate-50/80">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Account Status</h3>
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${userData.status === "approved"
                              ? "bg-emerald-100"
                              : "bg-rose-100"
                            }`}>
                            {userData.status === "approved" ? (
                              <CheckCircle className="h-6 w-6 text-emerald-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-rose-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {userData.status === "approved" ? "Account Approved" : "Account Rejected"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {userData.status === "approved"
                                ? "This account has been verified and is active."
                                : `Reason: ${userData.rejectionReason || "Not specified"}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {(userData?.status === 'approved') && (
                    <Button size="lg" className="w-full h-14 mt-5 rounded-xl font-bold text-lg bg-red-500 hover:bg-red-600 shadow-lg shadow-rose-500/20"
                    onClick={() => handleDelete(userData.id)}>{deleteLoading ? "Deleting..." : "Delete User" }</Button>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}