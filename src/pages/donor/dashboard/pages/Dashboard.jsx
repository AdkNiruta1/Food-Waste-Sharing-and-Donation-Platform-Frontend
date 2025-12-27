import { useState } from "react";
import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
// import { Tabs } from "../../../components/ui/tabs";
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
import { mockFoodPosts } from "../../../../lib/mockData";

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("posts");

  // Filter posts donated by this user (using mock data)
  const donorPosts = mockFoodPosts.filter((p) => p.donorId === "d1");

  const stats = [
    {
      label: "Total Donations",
      value: "12",
      change: "+2 this month",
      icon: <Package className="h-6 w-6" />,
      color: "text-primary",
    },
    {
      label: "Total Requests",
      value: "8",
      change: "+1 pending",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "text-secondary",
    },
    {
      label: "Completed",
      value: "7",
      change: "87.5% success",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-success",
    },
    {
      label: "Rating",
      value: "4.8",
      change: "Excellent donor",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-warning",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Donor Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your food donations and requests
              </p>
            </div>
            <Link to="/create-food">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Post New Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
              </div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "posts"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Donations ({donorPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "requests"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Incoming Requests (
              {donorPosts.reduce((sum, p) => sum + p.requests.length, 0)})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "analytics"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Analytics
            </button>
          </div>

          {/* My Donations Tab */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              {donorPosts.length === 0 ? (
                <Card className="p-12 text-center border-border">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No donations yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start sharing surplus food with your community
                  </p>
                  <Link to="/create-food">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Post Your First Donation
                    </Button>
                  </Link>
                </Card>
              ) : (
                donorPosts.map((post) => (
                  <Card key={post.id} className="p-6 border-border hover:shadow-lg transition-shadow">
                    <div className="grid md:grid-cols-4 gap-6 items-start">
                      {/* Image */}
                      <div className="md:col-span-1">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>

                      {/* Details */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <Link
                            to={`/food/${post.id}`}
                            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {post.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-semibold text-foreground">
                              {post.quantity} {post.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expires</p>
                            <p className="font-semibold text-foreground">
                              {new Date(post.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-semibold text-primary">
                              {post.status}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 space-y-2">
                        <Link to={`/food/${post.id}`}>
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                        {post.requests.length > 0 && (
                          <div className="bg-accent/10 text-accent rounded-lg p-2 text-center text-xs font-semibold">
                            {post.requests.length} request
                            {post.requests.length > 1 ? "s" : ""}
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
            <div className="space-y-4">
              {donorPosts.flatMap((post) =>
                post.requests.map((request) => (
                  <Card key={request.id} className="p-6 border-border">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      {/* Food Info */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          For
                        </p>
                        <h3 className="font-bold text-foreground text-lg">
                          {post.title}
                        </h3>
                      </div>

                      {/* Recipient Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Requested by
                          </p>
                          <p className="font-semibold text-foreground">
                            {request.recipientName}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Status
                        </p>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            request.status === "Pending"
                              ? "bg-warning/20 text-warning"
                              : request.status === "Accepted"
                                ? "bg-success/20 text-success"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {request.status}
                        </div>
                      </div>

                      {/* Actions */}
                      {request.status === "Pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {request.status === "Accepted" && (
                        <Button size="sm" variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}

              {donorPosts.every((p) => p.requests.length === 0) && (
                <Card className="p-12 text-center border-border">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No requests yet
                  </h3>
                  <p className="text-muted-foreground">
                    Recipients will request your donations here
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Your Impact
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Donations
                  </p>
                  <p className="text-4xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {donorPosts.length} active this month
                  </p>
                </div>

                <div className="p-6 bg-success/5 rounded-lg border border-success/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Meals Shared
                  </p>
                  <p className="text-4xl font-bold text-success">87</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ~3.6kg average per donation
                  </p>
                </div>

                <div className="p-6 bg-warning/5 rounded-lg border border-warning/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Community Rating
                  </p>
                  <p className="text-4xl font-bold text-warning">4.8/5</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on 12 donations
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
