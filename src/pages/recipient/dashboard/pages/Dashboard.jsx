import { useState } from "react";
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
} from "lucide-react";
import { mockFoodPosts } from "../../../../lib/mockData";

export default function RecipientDashboard() {
  const [activeTab, setActiveTab] = useState("active");

  // Mock user requests (filter posts that have requests from this recipient)
  const userRequests = [
    {
      id: "req1",
      postId: "1",
      recipientId: "rec1",
      status: "pending",
      requestedAt: "2025-04-01T15:00:00Z",
      post: mockFoodPosts.find((p) => p.id === "1"),
    },
    {
      id: "req2",
      postId: "3",
      recipientId: "rec1",
      status: "accepted",
      requestedAt: "2025-04-01T13:00:00Z",
      post: mockFoodPosts.find((p) => p.id === "3"),
    },
  ];

  const stats = [
    {
      label: "Active Requests",
      value: userRequests.length.toString(),
      change: `${userRequests.filter(r => r.status === "pending").length} pending approval`,
      icon: <Clock className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Completed Pickups",
      value: "5",
      change: "100% success rate",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Estimated Savings",
      value: "₹2,450",
      change: "From received donations",
      icon: <Heart className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Your Rating",
      value: "4.5",
      change: "Reliable & respectful",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <div className="border-b border-slate-200 bg-slate-50">
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
            <Link to="/browse">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Package className="mr-2 h-5 w-5" />
                Browse Available Food
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
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
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "active"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              Active Requests ({userRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "history"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              Pickup History (5)
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "saved"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              Saved Listings
            </button>
          </div>

          {/* Active Requests Tab */}
          {activeTab === "active" && (
            <div className="space-y-6">
              {userRequests.length === 0 ? (
                <Card className="p-16 text-center border-slate-200">
                  <Clock className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No active requests
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Browse available food and make a request when you find something.
                  </p>
                  <Link to="/browse">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Browse Food Now
                    </Button>
                  </Link>
                </Card>
              ) : (
                userRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="grid lg:grid-cols-5 gap-6 items-start">
                      {/* Image */}
                      <div className="lg:col-span-1">
                        <img
                          src={request.post?.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={request.post?.title}
                          className="w-full h-44 object-cover rounded-lg"
                        />
                      </div>

                      {/* Food & Donor Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <Link
                            to={`/food/${request.post?.id}`}
                            className="text-2xl font-bold text-slate-900 hover:text-green-600 transition-colors"
                          >
                            {request.post?.title || "Unknown Food"}
                          </Link>
                          <p className="text-slate-600 mt-2 line-clamp-2">
                            {request.post?.description}
                          </p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-slate-500" />
                            <div>
                              <p className="text-slate-600">Donated by</p>
                              <p className="font-medium text-slate-900">
                                {request.post?.donorName} ({request.post?.donorRating}★)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-slate-500" />
                            <div>
                              <p className="text-slate-600">Location</p>
                              <p className="font-medium text-slate-900">
                                {request.post?.location.city}, {request.post?.location.district}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="lg:col-span-2 space-y-5">
                        <div>
                          <p className="text-sm text-slate-600 mb-2">
                            Your Request Status
                          </p>
                          <span className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${
                            request.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {request.status === "pending"
                              ? "⏳ Awaiting Donor Approval"
                              : "✓ Approved – Ready for Pickup"}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <Link to={`/food/${request.post?.id}`} className="block">
                            <Button variant="outline" className="w-full border-slate-300">
                              View Donation Details
                            </Button>
                          </Link>
                          {request.status === "pending" && (
                            <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                              Cancel Request
                            </Button>
                          )}
                          {request.status === "accepted" && (
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              <MessageSquare className="mr-2 h-5 w-5" />
                              Message Donor
                            </Button>
                          )}
                        </div>

                        {request.status === "accepted" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                            <p className="font-medium text-green-700">
                              Coordinate pickup time and location with the donor via messages.
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

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="p-6 border-slate-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        Fresh Tomatoes & Vegetables
                      </h3>
                      <p className="text-slate-600 mt-1">
                        Received from Raj Kumar · Thamel, Kathmandu
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-slate-500">Picked up:</span>
                        <span className="font-medium text-slate-900">
                          April {10 - i}, 2025
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 mb-3">
                        ✓ Successfully Received
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-300">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Saved Listings Tab */}
          {activeTab === "saved" && (
            <Card className="p-20 text-center border-slate-200">
              <Heart className="h-20 w-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                No saved donations yet
              </h3>
              <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto">
                Save food listings you're interested in to request them later.
              </p>
              <Link to="/browse">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Browse & Save Food
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}