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
  Shield,
  Lock,
  Unlock,
  Search,
  Eye,
  Trash2,
} from "lucide-react";
import { mockFoodPosts } from "../../../../lib/mockData";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats: dashboardStats, loading, fetchStats } = useGetDashboardStats();
  const { error: exportError, loading: exportLoading, fetchExportFullReport } = useExportFullReport();
  const { error: exportUserError, loading: exportUserLoading, fetchExportUserAnalytics } = useExportUserAnalytics();
  const { error: exportReportError, loading: exportReportLoading, fetchExportFullReportMonthly } = useExportFullMonthlyReport();
  const { users, loading: usersLoading, fetchUsers } = useGetAllUsers();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);
  const stats = [
    {
      label: "Total Users",
      value: loading ? "..." : dashboardStats?.totalUsers?.toString() || "0",
      change: "+2 this month",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Food Posts",
      value: loading ? "..." : dashboardStats?.totalFoodPosts?.toString() || "0",
      change: "+1 pending review",
      icon: <Package className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Total Requests",
      value: loading ? "..." : dashboardStats?.totalRequests?.toString() || "0",
      change: "78% success rate",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Avg. Rating",
      value: loading ? "..." : dashboardStats?.averageRating?.toFixed(1) || "N/A",
      change: "Community satisfied",
      icon: <Shield className="h-6 w-6" />,
      color: "text-orange-600",
    },
  ];

  // Filter users by search + role
  // const filteredUsers = users.filter((user) => {
  //   const matchesSearch =
  //     user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchUser.toLowerCase());

  //   const matchesRole =
  //     userRoleFilter === "all" || user.role.toLowerCase() === userRoleFilter;

  //   return matchesSearch && matchesRole;
  // });

  // const filteredPosts = mockFoodPosts.filter((post) =>
  //   post.title.toLowerCase().includes(searchPost.toLowerCase())
  // );

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
                <Card className="p-6 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Donations Over Time
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { date: "Mon", donations: 4 },
                        { date: "Tue", donations: 6 },
                        { date: "Wed", donations: 5 },
                        { date: "Thu", donations: 7 },
                        { date: "Fri", donations: 9 },
                        { date: "Sat", donations: 8 },
                        { date: "Sun", donations: 10 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="donations"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ fill: "#16a34a" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

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
                    {mockFoodPosts.slice(0, 4).map((post) => (
                      <div key={post.id} className="p-4 rounded-lg bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-900">
                              {post.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              by {post.donorName} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                            {post.status}
                          </span>
                        </div>
                      </div>
                    ))}
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