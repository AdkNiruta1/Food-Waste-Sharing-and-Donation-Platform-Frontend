import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Package,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  MessageSquare,
  Eye,
  MapPin,
  Calendar,
  Award,
  RefreshCw,
  ChevronRight,
  Bell,
  Filter,
  Search,
  X,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { useGetMyFood } from "../hooks/useGetMyDonation";
import { useDeleteMyDonation } from "../hooks/useDeleteMyDonation";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetDonorStats } from "../hooks/useGetDonorStats";

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("posts");
  const { foods, loading, fetchMyFoodDonation } = useGetMyFood();
  const { deleteMyDonation, loading: deleteLoading } = useDeleteMyDonation();
  const { error, foods: statsFoods, fetchDonorStats, loading: statsLoading } = useGetDonorStats();

  // Fetch donations on mount
  useEffect(() => {
    fetchMyFoodDonation();
    fetchDonorStats();
  }, []);

  const handleDeleteDonation = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteMyDonation(id);
        fetchMyFoodDonation();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const navigate = useNavigate();

  const donorPosts = foods;

  const stats = [
    {
      label: "Total Donations",
      value: statsLoading ? "—" : statsFoods?.totalDonations || 0,
      change: "Lifetime contributions",
      icon: <Package className="h-6 w-6" />,
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100/50",
      borderColor: "border-emerald-200/60"
    },
    {
      label: "Total Requests",
      value: statsLoading ? "—" : statsFoods?.totalRequests || 0,
      change: "Requests received",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200/60"
    },
    {
      label: "Completed",
      value: statsLoading ? "—" : statsFoods?.totalCompletedDonations || 0,
      change: "Successfully delivered",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100/50",
      borderColor: "border-purple-200/60"
    },
    {
      label: "Avg Rating",
      value: statsLoading ? "—" : statsFoods?.avgRating?.toFixed(1) || "0.0",
      change: "Community feedback",
      icon: <Award className="h-6 w-6" />,
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
      bgColor: "from-amber-50 to-amber-100/50",
      borderColor: "border-amber-200/60"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'accepted': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'completed': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'expired': return 'bg-gradient-to-r from-rose-500 to-rose-600';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <Package className="h-4 w-4" />;
      case 'accepted': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <X className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading dashboard...</p>
        <p className="text-sm text-slate-500 mt-2">Preparing your donor insights</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Donor Dashboard
                </h1>
                <p className="text-lg text-slate-600 mt-2">
                  Manage your food donations and track your impact
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  fetchMyFoodDonation();
                  fetchDonorStats();
                }}
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Link to="/create-food">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20">
                  <Plus className="mr-2 h-5 w-5" />
                  Post New Donation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/60">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`p-6 rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
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
                <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-slate-600">{stat.change}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-slate-100/80 backdrop-blur-sm rounded-2xl p-1">
              <TabsTrigger
                value="posts"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60 px-6"
              >
                <Package className="mr-2 h-4 w-4" />
                My Donations ({donorPosts.length})
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60 px-6"
              >
                <Bell className="mr-2 h-4 w-4" />
                Active Requests
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-300/80 bg-white/90 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400"
                />
              </div>
              <Button variant="outline" size="sm" className="border-slate-300">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* My Donations Tab */}
          <TabsContent value="posts" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {donorPosts.length === 0 ? (
              <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-gradient-to-br from-slate-50 to-white">
                <div className="p-6 rounded-2xl bg-slate-100/80 inline-flex mb-6">
                  <Package className="h-20 w-20 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No donations yet
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Start sharing your surplus food and make a meaningful impact in your community.
                  Your generosity can feed someone in need today.
                </p>
                <Link to="/create-food">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20">
                    <Plus className="mr-2 h-5 w-5" />
                    Post Your First Donation
                  </Button>
                </Link>
              </Card>
            ) : (
              donorPosts.map((post) => (
                <Card
                  key={post._id}
                  className="p-6 rounded-2xl border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group"
                >
                  <div className="grid lg:grid-cols-4 gap-6 items-start">
                    {/* Image */}
                    <div className="lg:col-span-1">
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 group-hover:border-emerald-200 transition-colors">
                        <img
                          src={IMAGE_URL + (post.photo || "default-food.jpg")}
                          alt={post.title}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getStatusColor(post.status)} text-white shadow-lg`}>
                            {getStatusIcon(post.status)}
                            <span className="ml-1">{post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}</span>
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/60">
                            {post.quantity} {post.unit}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-5">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 mt-2 line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                          <p className="text-xs text-slate-500 mb-1">Quantity</p>
                          <p className="font-bold text-slate-900">
                            {post.quantity} {post.unit}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                          <p className="text-xs text-slate-500 mb-1">Expires</p>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                          <p className="text-xs text-slate-500 mb-1">Location</p>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {post.city || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Pending Requests Badge */}
                      {post.requests && post.requests.length > 0 && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60">
                          <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-amber-600" />
                            <p className="text-sm font-medium text-amber-700">
                              {post.requests.length} pending request{post.requests.length > 1 ? "s" : ""}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-amber-600 hover:bg-amber-100"
                              onClick={() => navigate(`/food/${post._id}`)}
                            >
                              View Requests
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1 space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/food-details/${post._id}`)}
                        className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `/update-food/${post._id}`}
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Post
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleDeleteDonation(post._id)}
                        disabled={deleteLoading}
                        className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400 transition-all"
                      >
                        {deleteLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Post
                          </>
                        )}
                      </Button>

                      {/* <Button
                        variant="ghost"
                        className="w-full text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                        onClick={() => navigate(`/donation/${post._id}`)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button> */}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Active Requests Tab */}
          <TabsContent value="requests" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          </TabsContent>
        </Tabs>

        {/* Quick Stats Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200/60">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-5 rounded-2xl border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-100/30">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Donation Tips</h4>
              </div>
              <p className="text-sm text-slate-600">
                Keep food fresh by posting within 2-3 days of expiry. Clear photos get more requests!
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-blue-200/60 bg-gradient-to-r from-blue-50 to-blue-100/30">
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Community Impact</h4>
              </div>
              <p className="text-sm text-slate-600">
                Each donation helps reduce food waste and feeds someone in need. Thank you for your contribution!
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/30">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-slate-900">Need Help?</h4>
              </div>
              <p className="text-sm text-slate-600">
                Contact our support team if you need assistance with donations or recipient coordination.
              </p>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}