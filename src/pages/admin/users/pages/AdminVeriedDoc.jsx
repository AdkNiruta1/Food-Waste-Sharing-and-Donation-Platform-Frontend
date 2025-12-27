import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Leaf, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Textarea } from "../../../../components/ui/textarea";

export default function AdminVerifyDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from navigation state
  const userData = location.state?.user || {
    name: "Unknown User",
    email: "unknown@example.com",
    phone: "N/A",
    role: "donor",
    documents: {
      citizenship: null,
      pan: null,
      drivingLicense: null,
    },
  };

  const [decision, setDecision] = useState("approve"); // "approve" | "reject"
  const [rejectionReason, setRejectionReason] = useState("");
  const [step, setStep] = useState("pending");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (decision === "reject" && !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (decision === "approve") {
        setStep("approved");
      } else {
        setStep("rejected");
      }

      // Redirect back after showing result
      setTimeout(() => navigate("/admin/pending-verifications"), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-3xl w-full p-10 border-slate-200">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Document Verification
            </h1>
          </div>

          {/* Approved State */}
          {step === "approved" && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Account Approved!
              </h2>
              <p className="text-slate-600">
                {userData.name}'s account has been successfully verified.
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Returning to pending list...
              </p>
            </div>
          )}

          {/* Rejected State */}
          {step === "rejected" && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Application Rejected
              </h2>
              <p className="text-slate-600 mb-6">
                {userData.name} has been notified.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6 text-left">
                <p className="font-medium text-slate-800 mb-1">Reason:</p>
                <p className="text-sm text-slate-700">{rejectionReason}</p>
              </div>
              <p className="text-sm text-slate-500">
                Returning to pending list...
              </p>
            </div>
          )}

          {/* Pending Review */}
          {step === "pending" && (
            <>
              <Alert className="mb-8 border-orange-200 bg-orange-50">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Carefully review all submitted documents before approving access.
                </AlertDescription>
              </Alert>

              <div className="space-y-8">
                {/* User Info */}
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-lg text-slate-900 mb-5">
                    User Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-slate-600">Name</p>
                      <p className="font-medium text-slate-900">{userData.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Email</p>
                      <p className="font-medium text-slate-900">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Phone</p>
                      <p className="font-medium text-slate-900">{userData.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Role</p>
                      <p className="font-medium capitalize text-green-600">{userData.role}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-lg text-slate-900 mb-6">
                    Submitted Documents
                  </h3>
                  <div className="space-y-5">
                    {userData.documents.citizenship && (
                      <div className="flex items-center justify-between p-5 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">
                            Citizenship Certificate
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {userData.documents.citizenship}
                          </p>
                        </div>
                        <CheckCircle className="h-7 w-7 text-green-600" />
                      </div>
                    )}
                    {userData.documents.pan && (
                      <div className="flex items-center justify-between p-5 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">PAN Card</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {userData.documents.pan}
                          </p>
                        </div>
                        <CheckCircle className="h-7 w-7 text-green-600" />
                      </div>
                    )}
                    {userData.documents.drivingLicense && (
                      <div className="flex items-center justify-between p-5 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">Driving License</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {userData.documents.drivingLicense}
                          </p>
                        </div>
                        <CheckCircle className="h-7 w-7 text-green-600" />
                      </div>
                    )}
                    {!userData.documents.citizenship && !userData.documents.pan && !userData.documents.drivingLicense && (
                      <p className="text-center text-slate-500 py-8">No documents submitted</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Decision Radio Buttons + Action */}
              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="space-y-4">
                  <label className="text-base font-medium text-slate-900">
                    Verification Decision *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        decision === "approve"
                          ? "border-green-600 bg-green-50"
                          : "border-slate-300 hover:border-slate-400 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="decision"
                        value="approve"
                        checked={decision === "approve"}
                        onChange={() => setDecision("approve")}
                        className="sr-only"
                      />
                      <CheckCircle className={`h-10 w-10 ${decision === "approve" ? "text-green-600" : "text-slate-400"}`} />
                      <p className="font-semibold text-slate-900">Approve Account</p>
                      <p className="text-sm text-slate-600">Grant full platform access</p>
                    </label>

                    <label
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        decision === "reject"
                          ? "border-red-600 bg-red-50"
                          : "border-slate-300 hover:border-slate-400 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="decision"
                        value="reject"
                        checked={decision === "reject"}
                        onChange={() => setDecision("reject")}
                        className="sr-only"
                      />
                      <XCircle className={`h-10 w-10 ${decision === "reject" ? "text-red-600" : "text-slate-400"}`} />
                      <p className="font-semibold text-slate-900">Reject Application</p>
                      <p className="text-sm text-slate-600">Request document changes</p>
                    </label>
                  </div>
                </div>

                {/* Rejection Reason (only when reject selected) */}
                {decision === "reject" && (
                  <div className="space-y-3">
                    <label htmlFor="reason" className="text-base font-medium text-slate-900">
                      Reason for Rejection *
                    </label>
                    <Textarea
                      id="reason"
                      placeholder="Explain what needs to be corrected or why the application is rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className={`w-full py-7 text-lg font-medium ${
                    decision === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={loading || (decision === "reject" && !rejectionReason.trim())}
                >
                  {loading
                    ? "Processing..."
                    : decision === "approve"
                    ? "Approve Account"
                    : "Send Rejection"}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}