import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { Badge } from "../../../../components/ui/badge";
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
  Loader2,
  Star,
  MapPin,
  Calendar,
  Shield,
  Award,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Eye,
  X,
  Heart,
  BarChart3,
  Sparkles,
  Navigation
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useAcceptRequestStatus } from "../hooks/useAcceptRequestStatus";
import { useGetFoodDetails } from "../../../recipient/browser/hooks/useGetFoodDetails";
import { useRejectRequestStatus } from "../hooks/useRejectedRequestStatus";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: {
      bg: "bg-gradient-to-r from-amber-50 to-amber-100/50",
      text: "text-amber-700",
      border: "border-amber-200/60",
      icon: <Clock className="h-3 w-3" />
    },
    accepted: {
      bg: "bg-gradient-to-r from-emerald-50 to-emerald-100/50",
      text: "text-emerald-700",
      border: "border-emerald-200/60",
      icon: <CheckCircle className="h-3 w-3" />
    },
    rejected: {
      bg: "bg-gradient-to-r from-rose-50 to-rose-100/50",
      text: "text-rose-700",
      border: "border-rose-200/60",
      icon: <XCircle className="h-3 w-3" />
    },
    completed: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100/50",
      text: "text-blue-700",
      border: "border-blue-200/60",
      icon: <CheckCircle className="h-3 w-3" />
    },
  };

  const style = styles[status] || styles.pending;

  return (
    <Badge className={`${style.bg} ${style.text} ${style.border} capitalize font-medium px-3 py-1.5`}>
      <span className="flex items-center gap-1.5">
        {style.icon}
        {status}
      </span>
    </Badge>
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= (rating || 0)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0">
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200/60 animate-in slide-in-from-bottom-2">
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b border-slate-200/60">
          <div className="flex items-center justify-between p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Request Details
                </h2>
                <p className="text-slate-600 text-sm mt-1">Manage this food request</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Receiver Profile */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/30 rounded-2xl p-6 border border-emerald-200/60">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {request.receiver?.profilePicture ? (
                    <img
                      src={IMAGE_URL + request.receiver.profilePicture}
                      className="w-full h-full object-cover"
                      alt={request.receiver?.name}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-emerald-600" />
                    </div>
                  )}
                </div>
                {request.receiver?.accountVerified === "verified" && (
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{request.receiver?.name}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Requested {new Date(request.requestedAt || request.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                {request.receiver?.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      {renderStars(request.receiver.rating)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {request.receiver.rating?.toFixed(1)} ({request.receiver.ratingCount || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Section */}
          {request.message && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-2xl p-6 border border-blue-200/60">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-3">Message from Receiver</h4>
                  <div className="bg-white/80 rounded-xl p-4 border border-blue-200/60">
                    <p className="text-slate-700 italic leading-relaxed">"{request.message}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Details */}
          <Card className="border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Contact Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-xs text-slate-500 mb-1">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <p className="font-medium text-slate-900 truncate">
                        {request?.receiver?.email || "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <p className="font-medium text-slate-900">
                        {request?.receiver?.phone || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-xs text-slate-500 mb-1">Account Status</p>
                    <div className="flex items-center gap-2">
                      {request?.receiver?.accountVerified === "verified" ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-emerald-700">Verified Account</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <span className="font-medium text-amber-700">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <p className="font-medium text-slate-900">
                        {request?.receiver?.address || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {request?.receiver?.bio && (
                <div className="mt-6 pt-6 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-medium text-slate-900">About</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-slate-700 italic">"{request.receiver.bio}"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {request.status === "pending" && (
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/60 p-6 -mx-8 -mb-8 mt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onAccept(request._id)}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Accept Request
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => onReject(request._id)}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-800"
                  size="lg"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject Request
                </Button>
              </div>
              
              {(acceptError || rejectError) && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/60">
                  <div className="flex items-center gap-3 text-rose-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{acceptError || rejectError}</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 text-center mt-4">
                Accepting a request will notify the recipient and mark others as rejected
              </p>
            </div>
          )}
        </div>
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
  const [filterStatus, setFilterStatus] = useState("all");

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <p className="text-lg font-medium text-slate-600 mt-4">Loading requests...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching all food requests</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <div className="p-4 rounded-2xl bg-rose-50/80 inline-flex mb-4">
            <AlertCircle className="h-12 w-12 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Requests</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const foodRequests = foods.requests || [];
  
  const filteredRequests = filterStatus === "all" 
    ? foodRequests 
    : foodRequests.filter(req => req.status === filterStatus);

  const stats = {
    pending: foodRequests.filter(r => r.status === 'pending').length,
    accepted: foodRequests.filter(r => r.status === 'accepted').length,
    rejected: foodRequests.filter(r => r.status === 'rejected').length,
    total: foodRequests.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60 sticky top-0 z-40 backdrop-blur-lg">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Food Requests</h1>
                <p className="text-lg text-slate-600 mt-2">
                  Manage requests for: <span className="font-semibold text-emerald-600">{foods.title}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-slate-300 hover:border-slate-400"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => FoodDonationDetails(foodId)}
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-50 to-white">
                <Filter className="h-5 w-5 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Filter Requests</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search by name..."
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-300/80 bg-white/90 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className={`${filterStatus === "all" ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'border-slate-300'}`}
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              className={`${filterStatus === "pending" ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : 'border-slate-300'}`}
            >
              Pending ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === "accepted" ? "default" : "outline"}
              onClick={() => setFilterStatus("accepted")}
              className={`${filterStatus === "accepted" ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'border-slate-300'}`}
            >
              Accepted ({stats.accepted})
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              onClick={() => setFilterStatus("rejected")}
              className={`${filterStatus === "rejected" ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white' : 'border-slate-300'}`}
            >
              Rejected ({stats.rejected})
            </Button>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="border-slate-200/80 rounded-2xl bg-gradient-to-br from-white to-slate-50/50">
            <CardContent className="py-20 text-center">
              <div className="p-6 rounded-2xl bg-slate-100/80 inline-flex mb-6">
                <Package className="h-20 w-20 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                No requests found
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {filterStatus === "all" 
                  ? "This food donation hasn't received any requests yet. Requests will appear here once people show interest."
                  : `No ${filterStatus} requests found.`
                }
              </p>
              {filterStatus !== "all" && (
                <Button
                  onClick={() => setFilterStatus("all")}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Show All Requests
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <Card
                key={req._id}
                className="border-slate-200/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm group cursor-pointer"
                onClick={() => setSelectedRequest(req)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-200 overflow-hidden">
                          {req.receiver?.profilePicture ? (
                            <img
                              src={IMAGE_URL + req.receiver.profilePicture}
                              className="w-full h-full object-cover"
                              alt={req.receiver?.name}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                              <User className="h-8 w-8 text-emerald-600" />
                            </div>
                          )}
                        </div>
                        {req.message && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 p-1 rounded-full shadow-md">
                            <MessageSquare className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {req.receiver?.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {new Date(req.requestedAt || req.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={req.status} />
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Food Item</p>
                      <p className="font-medium text-slate-900 truncate">
                        {req.foodPost?.title || foods.title}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Location</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {req.foodPost?.city || foods.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {req.receiver?.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i <= (req.receiver.rating || 0)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {req.receiver.rating?.toFixed(1)} rating
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(req);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Tips */}
        {stats.pending > 0 && (
          <Card className="mt-12 p-6 rounded-2xl border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-100/30">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <h4 className="font-semibold text-slate-900">Quick Tips</h4>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Respond to requests within 24 hours for best community experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Review receiver profiles and ratings before accepting requests</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Only one request can be accepted per food item</span>
              </li>
            </ul>
          </Card>
        )}
      </div>

      {/* Request Details Modal */}
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