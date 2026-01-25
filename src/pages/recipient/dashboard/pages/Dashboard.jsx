import { useEffect, useState } from "react";
import { Header } from "../../../../components/Header";
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
} from "lucide-react";
import { useGetFoodRequestList } from "../hooks/useGetFoodRequestList";
import { IMAGE_URL } from "../../../../constants/constants";
import { useCancelFoodRequest } from "../hooks/useCancelFoodRequest";
import { useAuth } from "../../../../context/AuthContext";

export default function RecipientDashboard() {
  const [activeTab, setActiveTab] = useState("active");
  const { foods: userRequests, loading, error, fetchFoodRequestList } = useGetFoodRequestList();
  const { cancelFoodRequest, error: cancelError } = useCancelFoodRequest();
  const [cancellingId, setCancellingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFoodRequestList();
  }, []);

  // Stats calculation
  const totalRequests = userRequests.length;
  const pendingRequests = userRequests.filter(r => r.status === "pending").length;
  const acceptedRequests = userRequests.filter(r => r.status === "accepted").length;
  const completedRequests = userRequests.filter(r => r.status === "completed").length;
  
  // Calculate average rating
  const completedWithRating = userRequests.filter(r => r.status === "completed" && r.foodPost?.receiver?.rating);


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
      value: (pendingRequests + acceptedRequests).toString(),
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
      value: `${user?.rating || "0.0"} ★`,
      change: `${completedWithRating.length} completed deliveries`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  // Filter requests based on active tab
  const getFilteredRequests = () => {
    switch (activeTab) {
      case "active":
        return userRequests.filter(request => 
          request.status === "pending" || request.status === "accepted"
        );
      case "history":
        return userRequests.filter(request => 
          request.status === "completed" || 
          request.status === "rejected" || 
          request.status === "cancelled"
        );
      default:
        return [];
    }
  };

  const filteredRequests = getFilteredRequests();

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClass = "inline-block px-4 py-1.5 rounded-full text-sm font-semibold";
    
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
      fetchFoodRequestList();
    } catch (err) {
      console.log(err);
      setCancellingId(null);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
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
            <Link to="/food-browse">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-shadow">
                <Package className="mr-2 h-5 w-5" />
                Browse Available Food
              </Button>
            </Link>
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

        {/* Tabs */}
        <div className="space-y-8">
          <div className="flex gap-8 border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${activeTab === "active"
                ? "text-green-600 border-green-600"
                : "text-slate-600 hover:text-slate-900 border-transparent"
                }`}
            >
              Active Requests ({pendingRequests + acceptedRequests})
            </button>
          </div>

          {/* Active Requests Tab */}
          {activeTab === "active" && (
            <div className="space-y-6">
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
                filteredRequests.map((request) => (
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
                                {request.foodPost?.donor.name} 
                                {request.foodPost?.donor.rating && (
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
                                {request.foodPost?.city}, {request.foodPost?.district}
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
                          
                          {cancelError && (
                            <p className="text-red-600 text-sm">{cancelError}</p>
                          )}
                          
                          {request.status === "accepted" && (
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                              <a href={`tel:${request.foodPost?.donor.phone}`}>
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Contact Donor
                              </a>
                            </Button>
                          )}
                        </div>

                        {request.status === "accepted" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                            <p className="font-medium text-green-700">
                              Coordinate pickup time and location can view in your donation details.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}