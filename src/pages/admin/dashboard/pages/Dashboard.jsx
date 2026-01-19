import { useEffect, useState } from "react";
import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Users,
  Package,
  TrendingUp,
  Download,
  Lock,
  Unlock,
  Star,
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
} from "recharts";
import { useGetDashboardStats } from "../hooks/useGetStats";
import { useExportFullReport } from "../hooks/useExportFullReport";
import { useExportUserAnalytics } from "../hooks/useExportUsers";
import { useExportFullMonthlyReport } from "../hooks/useExportReportLastMonth";
import { useGetAllUsers } from "../../users/hooks/useGetAllUsers";
import { useGetFoodPost } from "../hooks/useGetFoodPost";
import { useGetDonationOverTime } from "../hooks/useGetDonationOverTime";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats: dashboardStats, loading, fetchStats } = useGetDashboardStats();
  const { error: exportError, loading: exportLoading, fetchExportFullReport } = useExportFullReport();
  const { error: exportUserError, loading: exportUserLoading, fetchExportUserAnalytics } = useExportUserAnalytics();
  const { error: exportReportError, loading: exportReportLoading, fetchExportFullReportMonthly } = useExportFullMonthlyReport();
  const { users, loading: usersLoading, fetchUsers } = useGetAllUsers();
  const { error: foodPostError, loading: foodPostLoading, foodPost, fetchFoodPost } = useGetFoodPost();
  const { error: donationError, loading: donationLoading, foodPost: donationPost, fetchDonationOverTime } = useGetDonationOverTime();

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchFoodPost();
    fetchDonationOverTime();
  }, []);
  const stats = [

    {
      label: "Total Users",
      value: loading ? "—" : dashboardStats?.totalUsers?.toString() || "0",
      change: loading ? "—" : "Registered users",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Food Posts",
      value: loading ? "—" : dashboardStats?.totalFoodPosts?.toString() || "0",
      change: loading ? "—" : "Active donations",
      icon: <Package className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Total Requests",
      value: loading ? "—" : dashboardStats?.totalRequests?.toString() || "0",
      change: loading ? "—" : "All time requests",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Avg. Rating",
      value: loading ? "—" : dashboardStats?.averageRating?.toFixed(1) || "N/A",
      change: loading ? "—" : "Based on user feedback",
      icon: <Star className="h-6 w-6" />,
      color: "text-orange-600",
    },
  ];
  const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const normalizeDonationData = (apiData) => {
    return WEEK_DAYS.map(day => {
      const found = apiData?.find(d => d?.date === day);
      return {
        date: day,
        donations: found ? found.donations : 0,
      };
    });
  };
  console.log(`donation post ${donationPost}`);
  const chartData = normalizeDonationData(donationPost);


  const generateCSV = () => {
    fetchExportFullReport();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                Manage users, posts, and platform activities
              </p>
            </div>
            <Button
              onClick={generateCSV}
              variant="outline"
              className="border-slate-300"
              disabled={exportLoading}
            >
              <Download className="mr-2 h-5 w-5" />
              {exportLoading ? "Exporting..." : "Export CSV"}
            </Button>
            {exportError && (<div className="text-red-600 mt-2">{exportError}</div>)}

          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
        <div className="space-y-6">
          <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
            {["overview", "reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm capitalize transition-colors whitespace-nowrap border-b-2 ${activeTab === tab
                  ? "text-green-600 border-green-600"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Donations Over Time */}
                {donationLoading && (
                  <div className="flex items-center justify-center h-[320px]">
                    <p className="text-slate-500">Loading donations...</p>
                  </div>
                )}

                {!donationLoading && donationError && (
                  <div className="text-red-600 mt-2">
                    {donationError}
                  </div>
                )}

                {!donationLoading && !donationError && (
                  <Card className="p-6 border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Donations Over Time
                    </h3>

                    {donationPost?.length === 0 ? (
                      <div className="flex items-center justify-center h-[250px] text-slate-500">
                        No donation data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="donations"
                            stroke="#16a34a"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                          />
                        </LineChart>

                      </ResponsiveContainer>
                    )}
                  </Card>
                )}

                {/* Food Types Distribution */}
                <Card className="p-6 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Food Types Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Vegetables", value: 40 },
                          { name: "Fruits", value: 25 },
                          { name: "Cooked Meals", value: 20 },
                          { name: "Dairy & Bakery", value: 15 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#fb923c" />
                        <Cell fill="#22c55e" />
                        <Cell fill="#f97316" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Request Status Chart */}
              <Card className="p-6 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Request Status Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { status: "Pending", count: 3 },
                      { status: "Accepted", count: 7 },
                      { status: "Completed", count: 15 },
                      { status: "Rejected", count: 2 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="status" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Recent Posts
                  </h3>
                  <div className="space-y-3">
                    {foodPostLoading ? (
                      <div className="text-center py-4 text-slate-600">Loading...</div>
                    ) : foodPostError ? (
                      <div className="text-center py-4">
                        <p className="text-red-600 font-medium">{foodPostError}</p>
                      </div>
                    ) : foodPost && foodPost.length > 0 ? (
                      foodPost
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Recent first
                        .slice(0, 4)
                        .map((post) => (
                          <div
                            key={post.id}
                            className="p-4 rounded-lg bg-slate-50 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-slate-900 text-lg">{post.title}</p>
                                <p className="text-xs text-slate-600 mt-1">
                                  by <span className="font-semibold">{post?.donor?.name}</span> •{" "}
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${post.status === "available"
                                  ? "bg-green-100 text-green-700"
                                  : post.status === "accepted"
                                    ? "bg-blue-100 text-blue-700"
                                    : post.status === "completed"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                              >
                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center py-4 text-slate-500">No food posts found.</p>
                    )}
                  </div>

                </Card>

                <Card className="p-6 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Active Users
                  </h3>
                  <div className="space-y-3">
                    {usersLoading ? (
                      <div className="text-center py-4 text-slate-600">Loading...</div>
                    ) : users && users.length > 0 ? (
                      // Take the most recent 4 users
                      users
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 4)
                        .map((user) => (
                          <div
                            key={user._id}
                            className="p-4 rounded-lg bg-slate-50 flex justify-between items-start"
                          >
                            <div>
                              <p className="font-medium text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-600 mt-1">
                                {user.role} • {user.email}
                              </p>
                            </div>

                            {user.accountVerified === "verified" ? (
                              <Lock className="h-5 w-5 text-green-600" />
                            ) : (
                              <Unlock className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        ))
                    ) : (
                      <p className="text-center text-slate-500">No users found.</p>
                    )}
                  </div>

                </Card>
              </div>
            </div>
          )}


          {/* Posts Tab */}
          {/* {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchPost}
                  onChange={(e) => setSearchPost(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Title</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Donor</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Requests</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="py-4 px-6 font-medium text-slate-900">{post.title}</td>
                        <td className="py-4 px-6 text-slate-600">{post.donorName}</td>
                        <td className="py-4 px-6 text-slate-600 capitalize">{post.type}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {post.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">{post.requests.length}</td>
                        <td className="py-4 px-6 space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8 border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">
                  Platform Summary
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Total Donations</p>
                    <p className="text-4xl font-bold text-green-600">{dashboardStats?.totalFoodPosts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Total Requests</p>
                    <p className="text-4xl font-bold text-green-600">
                      {dashboardStats?.totalRequests}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Active Users</p>
                    <p className="text-4xl font-bold text-green-600">{dashboardStats?.totalUsers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Average Rate</p>
                    <p className="text-4xl font-bold text-green-600">{dashboardStats?.averageRating}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">
                  Export Reports
                </h3>
                <div className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={generateCSV}>
                    <Download className="mr-2 h-5 w-5" />
                    {exportLoading ? "Exporting..." : "Export Full Report ZIP"}
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300" onClick={fetchExportUserAnalytics}>
                    <Download className="mr-2 h-5 w-5" />
                    {exportUserLoading ? "Exporting..." : "Export Users CSV"}
                  </Button>
                  {exportUserError && (<div className="text-red-600 mt-2">{exportUserError}</div>)}
                  <Button variant="outline" className="w-full border-slate-300" onClick={fetchExportFullReportMonthly}>
                    <Download className="mr-2 h-5 w-5" />
                    {exportReportLoading ? "Exporting..." : "Export Monthly Report CSV"}
                  </Button>
                  {exportReportError && (<div className="text-red-600 mt-2">{exportReportError}</div>)}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}