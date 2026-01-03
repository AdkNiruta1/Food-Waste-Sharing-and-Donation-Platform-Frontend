import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Leaf, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Textarea } from "../../../../components/ui/textarea";

import { useVerifyUser } from "../hooks/useVerifyUser";
import { useRejectUser } from "../hooks/useRejectUser";
import { IMAGE_URL } from "../../../../constants/constants";

export default function AdminVerifyDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state?.user;
  console.log("User Data:", userData);

  const { verifyUser, loading: verifyLoading } = useVerifyUser();
  const { rejectUser, loading: rejectLoading } = useRejectUser();

  const [decision, setDecision] = useState("approve");
  const [rejectionReason, setRejectionReason] = useState("");
  const [step, setStep] = useState("pending");

  const loading = verifyLoading || rejectLoading;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">No user data provided</p>
      </div>
    );
  }
  const DOCUMENTS = [
    { key: "citizenship", label: "Citizenship Certificate" },
    { key: "pan", label: "PAN Card" },
    { key: "drivingLicense", label: "Driving License" },
  ];

  /* =========================
     SUBMIT HANDLER
  ========================== */
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

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-3xl w-full p-10 border-slate-200">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Leaf className="h-8 w-8 text-green-600" />
            {userData.status === "pending" ? <h1 className="text-3xl font-bold text-slate-900">
              Document Verification
            </h1>: <h1 className="text-3xl font-bold text-slate-900">User Details</h1>}
          </div>
          {/* ================= APPROVED ================= */}
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

          {/* ================= REJECTED ================= */}
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

          {/* ================= PENDING ================= */}
          {step === "pending" && (
            <>
              <Alert className="mb-8 border-orange-200 bg-orange-50">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Carefully review all submitted documents before approving access.
                </AlertDescription>
              </Alert>

              {/* USER INFO */}
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-8">
                <h3 className="font-semibold text-lg mb-5">User Information</h3>
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-slate-600">Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Role</p>
                    <p className="font-medium capitalize text-green-600">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </div>
              {/* ================= DOCUMENTS ================= */}
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-8">
                <h3 className="font-semibold text-lg mb-5">Submitted Documents</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {DOCUMENTS.map(({ key, label }) => {
                    const file = userData.documents?.[key];
                    if (!file) return null;

                    const isPdf = file.endsWith(".pdf");

                    return (
                      <Card
                        key={key}
                        className="p-5 border hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{label}</p>
                            {/* <p className="text-sm text-slate-500 truncate max-w-50">
                              {file.split("/").pop()}
                            </p> */}
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`${IMAGE_URL}${file}`, "_blank")}
                          >
                            View
                          </Button>
                        </div>

                        {isPdf ? (
                          <p className="text-xs text-slate-500 mt-2">PDF Document</p>
                        ) : (
                          <img
                            src={`${IMAGE_URL}${file}`}
                            alt={label}
                            className="mt-3 rounded border max-h-40 object-contain"
                          />
                        )}
                      </Card>
                    );
                  })}
                </div>

                {/* No documents fallback */}
                {!DOCUMENTS.some(d => userData.documents?.[d.key]) && (
                  <p className="text-center text-slate-500 py-6">
                    No documents submitted
                  </p>
                )}
              </div>

              {userData.status === "approved" || userData.status === "rejected" ? null :

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <label
                      className={`p-6 rounded-lg border-2 cursor-pointer text-center ${decision === "approve"
                        ? "border-green-600 bg-green-50"
                        : "border-slate-300"
                        }`}
                    >
                      <input
                        type="radio"
                        checked={decision === "approve"}
                        onChange={() => setDecision("approve")}
                        className="sr-only"
                      />
                      <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
                      <p className="font-semibold mt-2">Approve Account</p>
                    </label>

                    <label
                      className={`p-6 rounded-lg border-2 cursor-pointer text-center ${decision === "reject"
                        ? "border-red-600 bg-red-50"
                        : "border-slate-300"
                        }`}
                    >
                      <input
                        type="radio"
                        checked={decision === "reject"}
                        onChange={() => setDecision("reject")}
                        className="sr-only"
                      />
                      <XCircle className="h-10 w-10 mx-auto text-red-600" />
                      <p className="font-semibold mt-2">Reject Application</p>
                    </label>
                  </div>

                  {decision === "reject" && (
                    <Textarea
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={5}
                    />
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || (decision === "reject" && !rejectionReason)}
                    className={`w-full ${decision === "approve"
                      ? "bg-green-600"
                      : "bg-red-600"
                      }`}
                  >
                    {loading ? "Processing..." : decision === "approve" ? "Approve Account" : "Send Rejection"}
                  </Button>


                </form>

              }
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
