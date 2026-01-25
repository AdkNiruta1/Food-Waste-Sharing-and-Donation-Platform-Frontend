import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  User,
  Calendar,
  MapPin,
  Award,
  Eye,
  ChevronRight,
  RefreshCw,
  Filter,
  Search,
  Shield,
  AlertCircle,
  Phone,
  ArrowRight,
  Share2,
  Scale,
  Thermometer
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { useGetFoodRequestList } from "../../dashboard/hooks/useGetFoodRequestList";
import { IMAGE_URL } from "../../../../constants/constants";
import RatingPopup from "./RatingPage";
import ReceiverViewDonorDetails from "./ReceiverViewDonorDetails";

export default function RequestHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [showDonorPopup, setShowDonorPopup] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { foods: userRequests, loading, error, fetchFoodRequestList } = useGetFoodRequestList();
  const completedRequests = userRequests?.filter((r) => r?.status === "completed");
  const acceptedRequests = userRequests?.filter((r) => r?.status === "accepted");
  const pendingRequests = userRequests?.filter((r) => r?.status === "pending");
  const rejectedRequests = userRequests?.filter((r) => r?.status === "rejected");
  const cancelledRequests = userRequests?.filter((r) => r?.status === "cancelled");
  useEffect(() => {
    fetchFoodRequestList();
  }, []);

  const handleRateFood = (request) => {
    setSelectedRequest(request);
    setShowRatingPopup(true);
  };

  const handleViewDonor = (donorId) => {
    setSelectedDonorId(donorId);
    setShowDonorPopup(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'accepted': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'pending': return 'bg-gradient-to-r from-amber-500 to-amber-600';
      case 'rejected': return 'bg-gradient-to-r from-rose-500 to-rose-600';
      case 'cancelled': return 'bg-gradient-to-r from-slate-500 to-slate-600';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'accepted': return <CheckCircle className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'rejected': return <XCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredRequests = () => {
    let requests = userRequests || [];
    
    // Filter by tab
    if (activeTab === "completed") requests = completedRequests || [];
    else if (activeTab === "accepted") requests = acceptedRequests || [];
    else if (activeTab === "pending") requests = pendingRequests || [];
    else if (activeTab === "rejected") requests = rejectedRequests || [];
    else if (activeTab === "cancelled") requests = cancelledRequests || [];
    
    // Filter by search query
    if (searchQuery) {
      requests = requests.filter(request => 
        request?.foodPost?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request?.foodPost?.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request?.foodPost?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return requests;
  };

  const calculateStats = () => {
    return {
      total: userRequests?.length || 0,
      completed: completedRequests?.length || 0,
      accepted: acceptedRequests?.length || 0,
      pending: pendingRequests?.length || 0,
      rejected: rejectedRequests?.length || 0,
      cancelled: cancelledRequests?.length || 0,
    };
  };

  const stats = calculateStats();

  const renderRequestCard = (request) => {
    const daysLeft = calculateDaysLeft(request?.foodPost?.expiryDate);
    
    return (
      <Card
        key={request?._id}
        className="p-6 rounded-2xl border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group"
      >
        <div className="grid lg:grid-cols-4 gap-6 items-start">
          {/* Food Image */}
          <div className="lg:col-span-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group-hover:border-emerald-200 transition-colors">
              <img
                src={IMAGE_URL + request?.foodPost?.photo}
                alt={request?.foodPost?.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge className={`${getStatusColor(request?.status)} text-white shadow-lg`}>
                  {getStatusIcon(request?.status)}
                  <span className="ml-1">{request?.status?.charAt(0).toUpperCase() + request?.status?.slice(1)}</span>
                </Badge>
              </div>
              <div className="absolute bottom-3 right-3">
                <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/60">
                  <Scale className="h-3 w-3 mr-1" />
                  {request?.foodPost?.quantity} {request?.foodPost?.unit}
                </Badge>
              </div>
              {daysLeft <= 7 && (
                <div className="absolute bottom-3 left-3">
                  <Badge className={`${
                    daysLeft <= 2 ? 'bg-gradient-to-r from-rose-500 to-rose-600' :
                    'bg-gradient-to-r from-amber-500 to-amber-600'
                  } text-white`}>
                    <Thermometer className="h-3 w-3 mr-1" />
                    {daysLeft} days left
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Food Details */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer">
                {request?.foodPost?.title}
              </h3>
              <p className="text-slate-600 mt-2 line-clamp-2">
                {request?.foodPost?.description}
              </p>
            </div>

            {/* Donor Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-slate-100/60 border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
              <div className="relative">
                {request?.foodPost?.donor?.profilePicture ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-200 group-hover:border-emerald-300 transition-colors">
                    <img
                      src={IMAGE_URL + request.foodPost.donor.profilePicture}
                      alt={request.foodPost.donor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all">
                    <User className="h-7 w-7 text-emerald-600" />
                  </div>
                )}
                {request?.foodPost?.donor?.accountVerified === "verified" && (
                  <div className="absolute -top-1 -right-1">
                    <Shield className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Donated by</p>
                    <button
                      onClick={() => handleViewDonor(request?.foodPost?.donor?._id)}
                      className="font-bold text-lg text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1"
                    >
                      {request.foodPost.donor?.name}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                  {request?.foodPost?.donor?.rating && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {renderStars(request.foodPost.donor.rating)}
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {request.foodPost.donor.rating?.toFixed(1) || "0.0"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                <p className="font-bold text-slate-900">
                  {request?.foodPost?.quantity} {request?.foodPost?.unit}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
                <p className="text-xs text-slate-500 mb-1">Requested</p>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(request?.requestedAt || request?.createdAt)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
                <p className="text-xs text-slate-500 mb-1">Location</p>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {request?.foodPost?.city || "Not specified"}
                </p>
              </div>
            </div>

            {/* Your Rating (if completed) */}
            {request?.status === "completed" && request?.rating && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">Your Rating</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(request?.rating?.value)}
                </div>
                {request?.rating?.comment && (
                  <p className="text-sm text-slate-700">
                    "{request?.rating?.comment}"
                  </p>
                )}
              </div>
            )}

            {/* Cancel Reason */}
            {request?.status === "cancelled" && request?.cancelReason && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/60">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                  <p className="text-sm font-medium text-rose-700">Cancellation Reason</p>
                </div>
                <p className="text-sm text-slate-600">
                  {request.cancelReason}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-1 space-y-3">
            {request?.status === "completed" && !request?.rating && (
              <Button
                onClick={() => handleRateFood(request)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all"
              >
                <Star className="mr-2 h-4 w-4" />
                Rate Donation
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => handleViewDonor(request?.foodPost?.donor?._id)}
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Donor
            </Button>

            {(request?.status === "accepted" || request?.status === "pending") && (
              <Button
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all"
                onClick={() => window.location.href = `tel:${request?.foodPost?.donor?.phone}`}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact Donor
              </Button>
            )}

            {/* <Button
              variant="ghost"
              className="w-full text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-all"
              onClick={() => navigate(`/food/${request?.foodPost?._id}`)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              View Details
            </Button> */}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading request history...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching your food requests</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading History</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button
            onClick={fetchFoodRequestList}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  My Request History
                </h1>
                <p className="text-lg text-slate-600 mt-2">
                  Track all your food requests — from pending to completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/browse">
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20">
                  Browse Food
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={fetchFoodRequestList}
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
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <TabsList className="bg-slate-100/80 backdrop-blur-sm rounded-2xl p-1 flex-wrap">
              <TabsTrigger value="all" className="rounded-xl px-4">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl px-4">
                Completed ({stats.completed})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="rounded-xl px-4">
                Accepted ({stats.accepted})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl px-4">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl px-4">
                Rejected ({stats.rejected})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-xl px-4">
                Cancelled ({stats.cancelled})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-300/80 bg-white/90 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400"
                />
              </div>
              <Button variant="outline" className="border-slate-300">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {filteredRequests().length === 0 ? (
              <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-gradient-to-br from-slate-50 to-white">
                <div className="p-6 rounded-2xl bg-slate-100/80 inline-flex mb-6">
                  <Package className="h-20 w-20 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No requests yet
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Start browsing available food and make your first request to help reduce food waste!
                </p>
                <Link to="/browse">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20">
                    Browse Available Food
                  </Button>
                </Link>
              </Card>
            ) : (
              filteredRequests().map(renderRequestCard)
            )}
          </TabsContent>

          {["completed", "accepted", "pending", "rejected", "cancelled"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {stats[tab] === 0 ? (
                <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-gradient-to-br from-slate-50 to-white">
                  <div className={`p-6 rounded-2xl ${
                    tab === 'completed' ? 'bg-emerald-100/80' :
                    tab === 'accepted' ? 'bg-blue-100/80' :
                    tab === 'pending' ? 'bg-amber-100/80' :
                    tab === 'rejected' ? 'bg-rose-100/80' :
                    'bg-slate-100/80'
                  } inline-flex mb-6`}>
                    {tab === 'completed' || tab === 'accepted' ? (
                      <CheckCircle className="h-20 w-20 text-current" />
                    ) : tab === 'pending' ? (
                      <Clock className="h-20 w-20 text-current" />
                    ) : (
                      <XCircle className="h-20 w-20 text-current" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    No {tab} requests
                  </h3>
                  <p className="text-slate-600">
                    {tab === 'completed' ? 'Your accepted requests will appear here once completed' :
                     tab === 'accepted' ? 'Donors will accept your requests here' :
                     tab === 'pending' ? 'Your pending requests will appear here' :
                     tab === 'rejected' ? 'That\'s great! All your requests have been successful' :
                     'You haven\'t cancelled any requests'}
                  </p>
                </Card>
              ) : (
                filteredRequests().map(renderRequestCard)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Rating Popup */}
      {showRatingPopup && selectedRequest && (
        <RatingPopup
          isOpen={showRatingPopup}
          onClose={() => {
            setShowRatingPopup(false);
            setSelectedRequest(null);
          }}
          fetchFoodRequestList={fetchFoodRequestList}
          // loading={ratingLoading}
          // error={ratingError}
          donation={selectedRequest?.foodPost}
        />
      )}

      {/* Donor Popup */}
      {showDonorPopup && selectedDonorId && (
        <ReceiverViewDonorDetails
          isOpen={showDonorPopup}
          onClose={() => {
            setShowDonorPopup(false);
            setSelectedDonorId(null);
          }}
          donorId={selectedDonorId}
        />
      )}
    </div>
  );
}