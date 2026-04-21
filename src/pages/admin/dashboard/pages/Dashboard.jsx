import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import {
  Users,
  Package,
  TrendingUp,
  Download,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  FileText,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Shield,
  Award
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetDashboardStats } from "../hooks/useGetStats";
import { useExportFullReport } from "../hooks/useExportFullReport";
import { useExportUserAnalytics } from "../hooks/useExportUsers";
import { useExportFullMonthlyReport } from "../hooks/useExportReportLastMonth";
import { useGetAllUsers } from "../../users/hooks/useGetAllUsers";
import { useGetFoodPost } from "../hooks/useGetFoodPost";
import { useGetDonationOverTime } from "../hooks/useGetDonationOverTime";
import { useGetFoodTypeDistrubution } from "../hooks/useGetFoodTypeDistrubution";
import { useGetRequestOverView } from "../hooks/useGetRequestOverView";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats: dashboardStats, loading, fetchStats } = useGetDashboardStats();
  const { error: exportError, loading: exportLoading, fetchExportFullReport } = useExportFullReport();
  const { error: exportUserError, loading: exportUserLoading, fetchExportUserAnalytics } = useExportUserAnalytics();
  const { error: exportReportError, loading: exportReportLoading, fetchExportFullReportMonthly } = useExportFullMonthlyReport();
  const { users, loading: usersLoading, fetchUsers } = useGetAllUsers();
  const { error: foodPostError, loading: foodPostLoading, foodPost, fetchFoodPost } = useGetFoodPost();
  const { error: donationError, loading: donationLoading, foodPost: donationPost, fetchDonationOverTime } = useGetDonationOverTime();
  const { error: foodTypeError, loading: foodTypeLoading, foodType, fetchFoodTypeDistribution } = useGetFoodTypeDistrubution();
  const { error: requestError, loading: requestLoading, request, fetchRequestOverView } = useGetRequestOverView();

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchFoodPost();
    fetchDonationOverTime();
    fetchFoodTypeDistribution();
    fetchRequestOverView();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: loading ? "—" : dashboardStats?.totalUsers?.toString() || "0",
      change: "Registered users",
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
    },
    {
      label: "Food Posts",
      value: loading ? "—" : dashboardStats?.totalFoodPosts?.toString() || "0",
      change: "Active donations",
      icon: <Package className="h-6 w-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "+8%",
    },
    {
      label: "Total Requests",
      value: loading ? "—" : dashboardStats?.totalRequests?.toString() || "0",
      change: "All time requests",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      trend: "+15%",
    },
    {
      label: "Avg. Rating",
      value: loading ? "—" : dashboardStats?.averageRating?.toFixed(1) || "N/A",
      change: "Based on user feedback",
      icon: <Star className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      trend: "+0.3",
    },
  ];

  const getLast7Days = () => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      result.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: d.toISOString().slice(0, 10),
      });
    }
    return result;
  };

  const normalizeDonationData = (apiData) => {
    const last7Days = getLast7Days();
    return last7Days.map(day => {
      const found = apiData?.find(d => d?.date === day.label);
      return {
        date: day.label,
        donations: found ? found.donations : 0,
      };
    });
  };
  const navigate = useNavigate();
  const chartData = normalizeDonationData(donationPost);

  const generateCSV = () => {
    fetchExportFullReport();
  };

  const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg shadow-emerald-500/20">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-slate-600 mt-2">
                  Real-time insights and platform analytics
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={generateCSV}
                variant="outline"
                className="border-slate-300 hover:border-slate-400"
                disabled={exportLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                {exportLoading ? "Exporting..." : "Export Full Report"}
              </Button>
              <Button
                onClick={() => {
                  fetchStats();
                  fetchUsers();
                  fetchFoodPost();
                }}
                variant="outline"
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 flex-1">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={`text-white bg-gradient-to-r ${stat.color} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {stat.trend}
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-900 mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-slate-500">
                {stat.change}
              </p>
            </Card>
          ))}
        </div>

        {/* Tabs and Time Filter */}
        <div className="mb-8">
          <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {["overview", "reports"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm capitalize rounded-xl transition-all ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab === "overview" ? (
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Overview
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Reports
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Donations Over Time */}
                <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">Donations Over Time</h3>
                        <p className="text-sm text-slate-500">Last 7 days performance</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      {donationPost?.reduce((sum, day) => sum + (day.donations || 0), 0)} donations
                    </Badge>
                  </div>

                  {donationLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-200 border-t-emerald-500"></div>
                    </div>
                  ) : donationError ? (
                    <div className="h-[300px] flex flex-col items-center justify-center text-rose-600">
                      <AlertCircle className="h-12 w-12 mb-3" />
                      {donationError}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b"
                          tick={{ fill: '#64748b' }}
                        />
                        <YAxis 
                          stroke="#64748b"
                          tick={{ fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="donations"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 6, fill: '#10b981' }}
                          activeDot={{ r: 8, fill: '#059669' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Card>

                {/* Food Types Distribution */}
                <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <PieChartIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">Food Types Distribution</h3>
                        <p className="text-sm text-slate-500">Categories overview</p>
                      </div>
                    </div>
                  </div>

                  {foodTypeLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500"></div>
                    </div>
                  ) : foodTypeError ? (
                    <div className="h-[300px] flex flex-col items-center justify-center text-rose-600">
                      <AlertCircle className="h-12 w-12 mb-3" />
                      {foodTypeError}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={foodType}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {foodType?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="space-y-3">
                        {foodType?.map((type, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium text-slate-900">{type.name}</span>
                            </div>
                            <span className="font-bold text-slate-900">{type.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Request Status Chart */}
              <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Request Status Overview</h3>
                      <p className="text-sm text-slate-500">Distribution by status</p>
                    </div>
                  </div>
                </div>

                {requestLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500"></div>
                  </div>
                ) : requestError ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-rose-600">
                    <AlertCircle className="h-12 w-12 mb-3" />
                    {requestError}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={request}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="status" 
                        stroke="#64748b"
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis 
                        stroke="#64748b"
                        tick={{ fill: '#64748b' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[8, 8, 0, 0]}
                        className="fill-blue-500"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              {/* Recent Activity Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Posts */}
                <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">Recent Food Posts</h3>
                        <p className="text-sm text-slate-500">Latest donations</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900"
                    onClick={() => navigate("/manage-posts")}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {foodPostLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-100 animate-pulse">
                            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : foodPostError ? (
                      <div className="text-center py-8 text-rose-600">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        {foodPostError}
                      </div>
                    ) : foodPost && foodPost.length > 0 ? (
                      foodPost
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 4)
                        .map((post) => (
                          <div
                            key={post.id}
                            className="p-4 rounded-xl border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                    {post.title}
                                  </h4>
                                  <Badge className={
                                    post.status === "available" ? "bg-emerald-100 text-emerald-800" :
                                    post.status === "accepted" ? "bg-blue-100 text-blue-800" :
                                    post.status === "completed" ? "bg-slate-100 text-slate-800" :
                                    "bg-amber-100 text-amber-800"
                                  }>
                                    {post.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {post.donor?.name}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Eye className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        No food posts found
                      </div>
                    )}
                  </div>
                </Card>

                {/* Active Users */}
                <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">Recent Users</h3>
                        <p className="text-sm text-slate-500">Latest registrations</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900"
                    onClick={() => navigate("/manage-users")}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {usersLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-100 animate-pulse">
                            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : users && users.length > 0 ? (
                      users
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 4)
                        .map((user) => (
                          <div
                            key={user._id}
                            className="p-4 rounded-xl border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900">{user.name}</h4>
                                  <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Badge className="bg-slate-100 text-slate-700 capitalize">
                                      {user.role}
                                    </Badge>
                                    <span className="truncate max-w-[120px]">{user.email}</span>
                                  </div>
                                </div>
                              </div>
                              {user.accountVerified === "verified" ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-amber-600" />
                              )}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        No users found
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-8 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Platform Summary</h3>
                    <p className="text-slate-600">Key metrics and statistics</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/60">
                    <p className="text-sm text-emerald-700 font-semibold mb-2">Total Donations</p>
                    <p className="text-4xl font-bold text-slate-900">{dashboardStats?.totalFoodPosts || 0}</p>
                    <p className="text-sm text-emerald-600 mt-1">Active food donations</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/60">
                    <p className="text-sm text-blue-700 font-semibold mb-2">Total Requests</p>
                    <p className="text-4xl font-bold text-slate-900">{dashboardStats?.totalRequests || 0}</p>
                    <p className="text-sm text-blue-600 mt-1">All time requests</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60">
                    <p className="text-sm text-amber-700 font-semibold mb-2">Active Users</p>
                    <p className="text-4xl font-bold text-slate-900">{dashboardStats?.totalUsers || 0}</p>
                    <p className="text-sm text-amber-600 mt-1">Registered members</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200/60">
                    <p className="text-sm text-purple-700 font-semibold mb-2">Average Rating</p>
                    <p className="text-4xl font-bold text-slate-900">{dashboardStats?.averageRating?.toFixed(1) || 'N/A'}</p>
                    <p className="text-sm text-purple-600 mt-1">Community feedback score</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                    <Download className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Export Reports</h3>
                    <p className="text-slate-600">Download detailed analytics</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={generateCSV}
                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
                    disabled={exportLoading}
                  >
                    <Download className="mr-3 h-5 w-5" />
                    {exportLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Exporting...
                      </div>
                    ) : (
                      "Export Full Report (ZIP)"
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={fetchExportUserAnalytics}
                    className="w-full h-14 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                    disabled={exportUserLoading}
                  >
                    <Download className="mr-3 h-5 w-5" />
                    {exportUserLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Exporting...
                      </div>
                    ) : (
                      "Export Users Report (PDF)"
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={fetchExportFullReportMonthly}
                    className="w-full h-14 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                    disabled={exportReportLoading}
                  >
                    <Download className="mr-3 h-5 w-5" />
                    {exportReportLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Exporting...
                      </div>
                    ) : (
                      "Export Monthly Report (PDF)"
                    )}
                  </Button>
                </div>

                {/* Error Display */}
                {(exportError || exportUserError || exportReportError) && (
                  <div className="mt-6 p-4 rounded-xl bg-rose-50/80 border border-rose-200/60">
                    <div className="flex items-center gap-3 text-rose-700">
                      <AlertCircle className="h-5 w-5" />
                      <div>
                        {exportError && <p className="text-sm">{exportError}</p>}
                        {exportUserError && <p className="text-sm">{exportUserError}</p>}
                        {exportReportError && <p className="text-sm">{exportReportError}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Data Privacy</p>
                      <p className="text-xs text-slate-600">
                        All exported reports are encrypted and contain anonymized data
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}