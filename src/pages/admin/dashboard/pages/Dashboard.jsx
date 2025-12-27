import { useState } from "react";
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
import { mockFoodPosts, mockUsers } from "../../../../lib/mockData";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchUser, setSearchUser] = useState("");
  const [searchPost, setSearchPost] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all"); // New: role filter

  const stats = [
    {
      label: "Total Users",
      value: mockUsers.length.toString(),
      change: "+2 this month",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Food Posts",
      value: mockFoodPosts.length.toString(),
      change: "+1 pending review",
      icon: <Package className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Total Requests",
      value: mockFoodPosts.reduce((sum, p) => sum + p.requests.length, 0).toString(),
      change: "78% success rate",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Avg. Rating",
      value: "4.6",
      change: "Community satisfied",
      icon: <Shield className="h-6 w-6" />,
      color: "text-orange-600",
    },
  ];

  // Filter users by search + role
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase());

    const matchesRole =
      userRoleFilter === "all" || user.role.toLowerCase() === userRoleFilter;

    return matchesSearch && matchesRole;
  });

  const filteredPosts = mockFoodPosts.filter((post) =>
    post.title.toLowerCase().includes(searchPost.toLowerCase())
  );

  const generateCSV = () => {
    const headers = [
      "Post ID",
      "Donor",
      "Food Type",
      "Quantity",
      "Status",
      "Created Date",
      "Requests Count",
      "Location",
    ];

    const rows = mockFoodPosts.map((post) => [
      post.id,
      post.donorName,
      post.type,
      `${post.quantity} ${post.unit}`,
      post.status,
      new Date(post.createdAt).toLocaleDateString(),
      post.requests.length,
      `${post.location.city}, ${post.location.district}`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute("download", `annapurna-bhandar-logs-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

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
            <Button onClick={generateCSV} variant="outline" className="border-slate-300">
              <Download className="mr-2 h-5 w-5" />
              Export CSV
            </Button>
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
            {["overview", "users", "posts", "reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm capitalize transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab
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
                    {mockUsers.slice(0, 4).map((user) => (
                      <div key={user.id} className="p-4 rounded-lg bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {user.role} • {user.email}
                            </p>
                          </div>
                          {user.isSuspended ? (
                            <Lock className="h-5 w-5 text-red-600" />
                          ) : (
                            <Unlock className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Role Filter Radio Buttons */}
              <div className="flex flex-wrap gap-3">
                {["all", "donor", "recipient", "admin"].map((role) => (
                  <label
                    key={role}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border cursor-pointer transition-all ${
                      userRoleFilter === role
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value={role}
                      checked={userRoleFilter === role}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="sr-only"
                    />
                    <span className="capitalize font-medium">
                      {role === "all" ? "All Users" : role + "s"}
                    </span>
                  </label>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Role</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="py-4 px-6 font-medium text-slate-900">{user.name}</td>
                        <td className="py-4 px-6 text-slate-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isSuspended
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {user.isSuspended ? "Suspended" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 px-6 space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className={user.isSuspended ? "text-green-600" : "text-orange-600"}>
                            {user.isSuspended ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
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
          )}

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
                    <p className="text-4xl font-bold text-green-600">{mockFoodPosts.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Total Requests</p>
                    <p className="text-4xl font-bold text-green-600">
                      {mockFoodPosts.reduce((sum, p) => sum + p.requests.length, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Active Users</p>
                    <p className="text-4xl font-bold text-green-600">{mockUsers.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Success Rate</p>
                    <p className="text-4xl font-bold text-green-600">78%</p>
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
                    Download Full CSV Report
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300">
                    <Download className="mr-2 h-5 w-5" />
                    Export User Analytics (PDF)
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300">
                    <Download className="mr-2 h-5 w-5" />
                    Export Monthly Summary
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}