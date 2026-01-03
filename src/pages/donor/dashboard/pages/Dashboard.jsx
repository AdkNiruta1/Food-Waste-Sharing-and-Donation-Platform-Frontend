import { useEffect, useState } from "react";
import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Link } from "react-router-dom";
import {
  Plus,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  MessageSquare,
  User,
} from "lucide-react";
import { useGetMyFood } from "../hooks/useGetMyDonation";
import { IMAGE_URL } from "../../../../constants/constants";
export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("posts");
  const { foods, loading, fetchMyFoodDonation } = useGetMyFood();

  // Fetch donations on mount
  useEffect(() => {
    fetchMyFoodDonation();
  }, []);

  // Filter posts donated by current user (mock)
  const donorPosts = foods;

  const stats = [
    {
      label: "Total Donations",
      value: donorPosts.length.toString(),
      change: "+2 this month",
      icon: <Package className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Total Requests",
      value: donorPosts.reduce((sum, p) => sum + p.length, 0).toString(),
      change: "+1 pending",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Completed",
      value: donorPosts.reduce((sum, p) => sum + (p.status === "completed" ? 1 : 0), 0).toString(),
      change: "87.5% success rate",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Rating",
      value: "4.8",
      change: "Excellent donor",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-yellow-600",
    },
  ];

  return (
    loading ? <div>Loading...</div> :
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Donor Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                Manage your food donations and track your impact
              </p>
            </div>
            <Link to="/create-food">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-5 w-5" />
                Post New Donation
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
              onClick={() => setActiveTab("posts")}
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "posts"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              My Donations ({donorPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "requests"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              Incoming Requests ({donorPosts.reduce((sum, p) => sum + p.length, 0)})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "analytics"
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              Analytics
            </button>
          </div>

          {/* My Donations Tab */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              {donorPosts.length === 0 ? (
                <Card className="p-16 text-center border-slate-200">
                  <Package className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No donations yet
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Start sharing your surplus food and make a difference in your community.
                  </p>
                  <Link to="/create-food">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-5 w-5" />
                      Post Your First Donation
                    </Button>
                  </Link>
                </Card>
              ) : (
                donorPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="grid lg:grid-cols-4 gap-6 items-start">
                      {/* Image */}
                      <div className="lg:col-span-1">
                        <img
                          src={IMAGE_URL+ post.photo || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      {/* Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <Link
                            to={`/food/${post.id}`}
                            className="text-2xl font-bold text-slate-900 hover:text-green-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-slate-600 mt-2 line-clamp-2">
                            {post.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Quantity</p>
                            <p className="font-semibold text-slate-900">
                              {post.quantity} {post.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Best Before</p>
                            <p className="font-semibold text-slate-900">
                              {new Date(post.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              post.status === "available"
                                ? "bg-green-100 text-green-700"
                                : post.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 space-y-3">
                        <Link to={`/food/${post._id}`} className="block">
                          <Button variant="outline" className="w-full border-slate-300">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full border-slate-300">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Post
                        </Button>
                        <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>

                        {post.length > 0 && (
                          <div className="bg-orange-100 text-orange-700 rounded-lg p-3 text-center">
                            <p className="text-sm font-semibold">
                              {post.requests.length} pending request{post.requests.length > 1 ? "s" : ""}
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

          {/* Incoming Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {donorPosts.flatMap((post) => post).length !== 0 ? (
                <Card className="p-16 text-center border-slate-200">
                  <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No incoming requests
                  </h3>
                  <p className="text-slate-600">
                    When someone requests your food, you'll see it here.
                  </p>
                </Card>
              ) : (
                donorPosts.flatMap((post) =>
                  post.map((request) => (
                    <Card
                      key={request.id}
                      className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="grid lg:grid-cols-4 gap-6 items-center">
                        {/* Food Info */}
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Donation</p>
                          <h3 className="font-bold text-lg text-slate-900">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {post.quantity} {post.unit}
                          </p>
                        </div>

                        {/* Recipient Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-7 w-7 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Requested by</p>
                            <p className="font-semibold text-slate-900">
                              {request.recipientName}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Status</p>
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                            request.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : request.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          {request.status === "pending" && (
                            <>
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" className="w-full border-slate-300">
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === "accepted" && (
                            <Button size="sm" variant="outline" className="w-full border-slate-300">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Contact Recipient
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-8 border-slate-200 bg-green-50">
                <h3 className="text-xl font-bold text-green-700 mb-4">
                  Total Donations
                </h3>
                <p className="text-5xl font-bold text-green-600 mb-2">
                  {donorPosts.length}
                </p>
                <p className="text-sm text-slate-600">
                  Active posts this month
                </p>
              </Card>

              <Card className="p-8 border-slate-200 bg-blue-50">
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  Meals Shared
                </h3>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  87
                </p>
                <p className="text-sm text-slate-600">
                  Estimated from your donations
                </p>
              </Card>

              <Card className="p-8 border-slate-200 bg-yellow-50">
                <h3 className="text-xl font-bold text-yellow-700 mb-4">
                  Community Rating
                </h3>
                <p className="text-5xl font-bold text-yellow-600 mb-2">
                  4.8 ★
                </p>
                <p className="text-sm text-slate-600">
                  Based on recipient feedback
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}