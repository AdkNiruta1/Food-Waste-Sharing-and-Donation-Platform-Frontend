import { useEffect, useState, useCallback } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Heart,
  MapPin,
  User,
  Package,
  XCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Filter,
  RefreshCw
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useCancelFoodRequest } from "../hooks/useCancelFoodRequest";
import { Pagination } from "../../../../components/Paginations";
import { useGetActiveFoodRequestList } from "../hooks/useGetFoodRequestActiveList"; // Fixed import
import { useFoodRequestStats } from "../hooks/useGetFoodRequestStats";

export default function RecipientDashboard() {
  const [activeTab, setActiveTab] = useState("active");
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  
  const { 
    foods: userRequests, 
    loading, 
    error, 
    fetchActiveFoodRequestList, 
    pagination,
  } = useGetActiveFoodRequestList();
  
  const { cancelFoodRequest, error: cancelError } = useCancelFoodRequest();
  const [cancellingId, setCancellingId] = useState(null);

  const { stats: apiStats, loading: statsLoading} = useFoodRequestStats(); // Stats are now calculated locally from the request list, so we don't need to fetch them separately

  // Fetch data when page or tab changes
  useEffect(() => {
    const page = activeTab === "active" ? activeCurrentPage : 1;
    fetchActiveFoodRequestList(page, activeTab === "active" ? "active" : "history", 10);
  }, [activeCurrentPage, activeTab, fetchActiveFoodRequestList]);

  // Calculate stats from API data or local filtering
  const totalRequests = statsLoading ?  "..."  : apiStats?.totalRequests || "0";
  const pendingRequests =  statsLoading? "..." : apiStats?.pendingRequests || "0";
  const acceptedRequests = statsLoading ? "..." : apiStats?.acceptedRequests || "0";
  const completedRequests = statsLoading ? "..." : apiStats?.completedRequests || "0";

  // Calculate average rating
  const averageRating = statsLoading? "..." : apiStats?.averageRating || "0";

  const stats = [
    {
      label: "Total Requests",
      value: totalRequests.toString(),
      change: `${pendingRequests} pending, ${acceptedRequests} accepted`,
      icon: <Package className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Now",
      value: (parseInt(pendingRequests) + parseInt(acceptedRequests)).toString(),
      change: `${pendingRequests} pending, ${acceptedRequests} accepted`,
      icon: <Clock className="h-6 w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Completed",
      value: completedRequests.toString(),
      change: "Successfully received",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Your Rating",
      value: `${averageRating} ★`,
      change: `${completedRequests} completed deliveries`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  // Filter requests based on active tab
  const getFilteredRequests = useCallback(() => {
    switch (activeTab) {
      case "active":
        return userRequests.filter(request => 
          request.status === "pending" || request.status === "accepted"
        );
      case "history":
        return userRequests.filter(request => 
          request.status === "completed" || request.status === "cancelled" || request.status === "rejected"
        );
      default:
        return [];
    }
  }, [activeTab, userRequests]);

  const filteredRequests = getFilteredRequests();

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClass = "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold";
    
    switch(status) {
      case "pending":
        return `${baseClass} bg-orange-100 text-orange-700 border border-orange-200`;
      case "accepted":
        return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-700 border border-green-200`;
      case "cancelled":
        return `${baseClass} bg-red-100 text-red-700 border border-red-200`;
      case "rejected":
        return `${baseClass} bg-gray-100 text-gray-700 border border-gray-200`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case "pending":
        return "⏳ Awaiting Donor Approval";
      case "accepted":
        return "✓ Approved – Ready for Pickup";
      case "completed":
        return "✅ Successfully Received";
      case "cancelled":
        return "❌ Cancelled";
      case "rejected":
        return "⛔ Donor Rejected";
      default:
        return status;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      setCancellingId(id);
      await cancelFoodRequest({ "requestId": id });
      // Refresh the current page after cancellation
      const page = activeTab === "active" ? activeCurrentPage : 1;
      await fetchActiveFoodRequestList(page, activeTab === "active" ? "active" : "history", 10);
    } catch (err) {
      console.error("Cancel error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleActivePageChange = (newPage) => {
    setActiveCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    const page = activeTab === "active" ? activeCurrentPage : 1;
    await fetchActiveFoodRequestList(page, activeTab === "active" ? "active" : "history", 10);
  };

  if (loading && userRequests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Recipient Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                Track your food requests and received donations
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={loading}
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link to="/food-browse">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-shadow">
                  <Package className="mr-2 h-5 w-5" />
                  Browse Available Food
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-slate-600">{stat.change}</p>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200">
            <div className="flex gap-8 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab("active");
                  setActiveCurrentPage(1);
                }}
                className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${activeTab === "active"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
                  }`}
              >
                Active Requests ({parseInt(pendingRequests) + parseInt(acceptedRequests)})
              </button>
              
            </div>
          </div>

          {/* Active Requests Tab */}
          {activeTab === "active" && (
            <div className="space-y-6">
              {/* Results Info */}
              {pagination && pagination.total > 0 && (
                <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
                  <p>
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} active requests
                  </p>
                  <div className="flex items-center gap-2">
                    <span>Items per page: {pagination.limit}</span>
                  </div>
                </div>
              )}

              {filteredRequests.length === 0 ? (
                <Card className="p-16 text-center border-slate-200 shadow-sm">
                  <Package className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No active requests
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Browse available food and make a request when you find something.
                  </p>
                  <Link to="/food-browse">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Browse Food Now
                    </Button>
                  </Link>
                </Card>
              ) : (
                <>
                  {filteredRequests.map((request) => (
                    <Card
                      key={request._id}
                      className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="grid lg:grid-cols-5 gap-6 items-start">
                        {/* Image */}
                        <div className="lg:col-span-1">
                          <img
                            src={request.foodPost?.photo 
                              ? IMAGE_URL + request.foodPost.photo 
                              : "https://via.placeholder.com/300x200?text=No+Image"}
                            alt={request.foodPost?.title}
                            className="w-full h-44 object-cover rounded-lg border border-slate-200"
                          />
                        </div>

                        {/* Food & Donor Details */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <Link
                              to={`/food/${request.foodPost?._id}`}
                              className="text-2xl font-bold text-slate-900 hover:text-green-600 transition-colors"
                            >
                              {request.foodPost?.title || "Unknown Food"}
                            </Link>
                            <p className="text-slate-600 mt-2 line-clamp-2">
                              {request.foodPost?.description}
                            </p>
                          </div>

                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-slate-600">Donated by</p>
                                <p className="font-medium text-slate-900">
                                  {request.foodPost?.donor?.name || "Unknown"} 
                                  {request.foodPost?.donor?.rating && (
                                    <span className="ml-2 text-yellow-600">
                                      ({request.foodPost.donor.rating}★)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <MapPin className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-slate-600">Location</p>
                                <p className="font-medium text-slate-900">
                                  {request.foodPost?.city || "N/A"}, {request.foodPost?.district || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-slate-600">Requested</p>
                                <p className="font-medium text-slate-900">
                                  {new Date(request.requestedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="lg:col-span-2 space-y-5">
                          <div>
                            <p className="text-sm text-slate-600 mb-2">
                              Request Status
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={getStatusBadge(request.status)}>
                                {getStatusIcon(request.status)}
                                <span className="ml-2">{getStatusText(request.status)}</span>
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Link to={`/food-donations/details/${request._id}`} className="block">
                              <Button variant="outline" className="w-full border-slate-300 hover:border-green-600 hover:text-green-600">
                                View Donation Details
                              </Button>
                            </Link>
                            
                            {request.status === "pending" && (
                              <Button
                                variant="outline"
                                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                onClick={() => handleCancelRequest(request._id)}
                                disabled={cancellingId === request._id}
                              >
                                {cancellingId === request._id ? "Cancelling..." : "Cancel Request"}
                              </Button>
                            )}
                            
                            {cancelError && cancellingId === request._id && (
                              <p className="text-red-600 text-sm">{cancelError}</p>
                            )}
                            
                            {request.status === "accepted" && request.foodPost?.donor?.phone && (
                              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                                <a href={`tel:${request.foodPost.donor.phone}`}>
                                  <MessageSquare className="mr-2 h-5 w-5" />
                                  Contact Donor
                                </a>
                              </Button>
                            )}
                          </div>

                          {request.status === "accepted" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                              <p className="font-medium text-green-700">
                                ✓ Request accepted! Check donation details for pickup information.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Active Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={activeCurrentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handleActivePageChange}
                        loading={loading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}