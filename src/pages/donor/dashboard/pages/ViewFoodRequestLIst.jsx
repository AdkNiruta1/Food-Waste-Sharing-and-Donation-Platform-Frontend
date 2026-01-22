import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import {
  ArrowLeft,
  User,
  CheckCircle,
  XCircle,
  Clock,

  Package,
  MessageSquare,

  ChevronRight,
  Phone,
  Mail,
  Users,
  AlertCircle,
  Loader2
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useAcceptRequestStatus } from "../hooks/useAcceptRequestStatus";
import { useGetFoodDetails } from "../../../recipient/browser/hooks/useGetFoodDetails";
import { useRejectRequestStatus } from "../hooks/useRejectedRequestStatus";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className={`inline-flex items-center capitalize border px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-70"></span>
      {status}
    </div>
  );
};


function RequestDetailsModal({
  open,
  onClose,
  request,
  onAccept,
  onReject,
  loading,
  acceptError,
  rejectError
}) {
  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95">
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              <p className="text-gray-500 text-sm mt-1">Manage this food request</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Receiver Profile */}
          <div className="bg-linear-to-r from-emerald-50 to-green-50 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
                  {request.receiver?.profilePicture ? (
                    <img
                      src={IMAGE_URL + request.receiver.profilePicture}
                      className="w-full h-full object-cover"
                      alt={request.receiver?.name}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <User className="h-10 w-10 text-emerald-600" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{request.receiver?.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(request.requestedAt || request.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Message Section */}
          {request.message && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Message from Receiver</h4>
                  <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-700 italic">"{request.message}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">User Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
               
                <DetailRow
                  label="Email"
                  value={request?.receiver?.email || "Not specified"}
                  icon={<Mail className="h-4 w-4" />}
                />
                <DetailRow
                  label="Phone"
                  value={request?.receiver?.phone || "Not specified"}
                  icon={<Phone className="h-4 w-4" />}
                />
                <DetailRow
                  label="Address"
                  value={request?.receiver?.address || "Not specified"}
                />
              </div>

              <div className="space-y-3">
                
                <DetailRow
                  label="Account Status"
                  value={request?.receiver?.accountVerified === "verified" ? "Verified ✓" : "Not Verified"}
                  className={request?.receiver?.accountVerified === "verified" ? "text-emerald-600" : "text-amber-600"}
                />

                <DetailRow
                  label="User Rating"
                  value={`${request?.receiver?.rating || 0}/5 (${request?.receiver?.ratingCount || 0} reviews)`}
                />

              </div>
            </div>

            {request?.receiver?.bio && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Bio</label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-700 italic">"{request.receiver.bio}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {request.status === "pending" && (
            <div className="sticky bottom-0 bg-white border-t p-6 -mx-6 -mb-6 mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
                  disabled={loading}
                  onClick={() => onAccept(request._id)}
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="mr-2 h-5 w-5" />
                  )}
                  Accept Request
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={loading}
                  onClick={() => onReject(request._id)}
                  size="lg"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject Request
                </Button>
              </div>
              {(acceptError || rejectError) && (
                <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-sm">{acceptError || rejectError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon, className = "" }) {
  return (
    <div className={`${className}`}>
      <label className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-gray-900 font-medium capitalize">{value || "Not specified"}</p>
      </div>
    </div>
  );
}

export default function ViewFoodRequestList() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { foods, loading, error, FoodDonationDetails } = useGetFoodDetails();
  const { loading: acceptLoading, error: acceptError, acceptRequest } = useAcceptRequestStatus();
  const { loading: rejectLoading, error: rejectError, rejectRequest } = useRejectRequestStatus();

  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    FoodDonationDetails(foodId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodId]);

  const handleAcceptRequest = async (data) => {
    const result = await acceptRequest(data);
    if (!result) return;
    // 2second delay to navigate back
    setTimeout(() => {
    navigate('/donor-dashboard');
    }, 2000);
    setSelectedRequest(null);
  }
  const handleRejectRequest = async (data) => {
    const result = await rejectRequest(data);
    if (!result) return;
    // 2second delay to navigate back
    setTimeout(() => {
    navigate('/donor-dashboard');
    }, 2000);
    setSelectedRequest(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md border-red-200">
          <CardContent className="pt-6 text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Requests</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const foodRequests = foods.requests || [];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Food Requests</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {foods.title || 'Food Post'}
                </p>
              </div>
            </div>
            <div className="bg-linear-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-100">
              <span className="font-semibold text-emerald-700">
                {foodRequests.length} request{foodRequests.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 bg-linear-to-r from-white to-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Manage Food Requests
              </h2>
              <p className="text-gray-600">
                Review and respond to requests for your food donation
              </p>
            </div>
            <div className="hidden md:block bg-white p-3 rounded-xl border shadow-sm">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {foodRequests.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {foodRequests.filter(r => r.status === 'accepted').length}
                  </div>
                  <div className="text-xs text-gray-500">Accepted</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">
                    {foodRequests.filter(r => r.status === 'rejected').length}
                  </div>
                  <div className="text-xs text-gray-500">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {foodRequests.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-linear-to-b from-white to-gray-50">
            <CardContent className="pt-12 pb-16 text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">No requests yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Your food donation hasn't received any requests yet. Requests will appear here once people show interest.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Food Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {foodRequests.map((req) => (
              <Card
                key={req._id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border hover:border-emerald-200"
                onClick={() => setSelectedRequest(req)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden">
                          {req.receiver?.profilePicture ? (
                            <img
                              src={IMAGE_URL + req.receiver.profilePicture}
                              className="w-full h-full object-cover"
                              alt={req.receiver?.name}
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                              <User className="h-7 w-7 text-emerald-600" />
                            </div>
                          )}
                        </div>
                        {req.message && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 shadow-md">
                            <MessageSquare className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{req.receiver?.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {new Date(req.requestedAt || req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={req.status} />
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Food Item</span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-50">
                        {req.foodPost?.title || foods.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="text-sm font-medium text-gray-900">
                        {req.foodPost?.city || foods.city}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <RequestDetailsModal
        open={!!selectedRequest}
        request={selectedRequest}
        loading={acceptLoading || rejectLoading}
        onClose={() => setSelectedRequest(null)}
        onAccept={(id) => handleAcceptRequest({ requestId: id })}
        onReject={(id) => handleRejectRequest({ requestId: id })}
        acceptError={acceptError}
        rejectError={rejectError}
      />
    </div>
  );
}