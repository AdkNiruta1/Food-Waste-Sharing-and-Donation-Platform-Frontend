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

  // Mock user requests
  const userRequests = [
    {
      id: "req1",
      postId: "1",
      recipientId: "rec1",
      status: "Pending",
      requestedAt: "2024-12-12T15:00:00Z",
      post: mockFoodPosts.find((p) => p.id === "1"),
    },
    {
      id: "req2",
      postId: "3",
      recipientId: "rec1",
      status: "Accepted",
      requestedAt: "2024-12-12T13:00:00Z",
      post: mockFoodPosts.find((p) => p.id === "3"),
    },
  ];

  const stats = [
    {
      label: "Active Requests",
      value: "2",
      change: "1 pending approval",
      icon: <Clock className="h-6 w-6" />,
      color: "text-primary",
    },
    {
      label: "Completed",
      value: "5",
      change: "100% completion rate",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-success",
    },
    {
      label: "Saved Amount",
      value: "₹2,450",
      change: "From 5 donations",
      icon: <Heart className="h-6 w-6" />,
      color: "text-warning",
    },
    {
      label: "Your Rating",
      value: "4.5",
      change: "Reliable recipient",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-secondary",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      

      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Recipient Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your food requests and donations received
              </p>
            </div>
            <Link to="/browse">
              <Button size="lg">
                <Package className="mr-2 h-5 w-5" />
                Browse More Food
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
              onClick={() => setActiveTab("active")}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "active"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Requests (2)
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "history"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              History (5)
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "saved"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Listings
            </button>
          </div>

          {/* Active Requests */}
          {activeTab === "active" && (
            <div className="space-y-4">
              {userRequests.map((request) =>
                request.post ? (
                  <Card key={request.id} className="p-6 border-border">
                    <div className="grid md:grid-cols-5 gap-6 items-start">
                      {/* Image */}
                      <div>
                        <img
                          src={request.post.imageUrl}
                          alt={request.post.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Food Details */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <Link
                            to={`/food/${request.post.id}`}
                            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {request.post.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.post.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">
                            {request.post.donorName}
                          </span>
                          <span className="text-muted-foreground">
                            ({request.post.donorRating}★)
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {request.post.location.city},{" "}
                            {request.post.location.district}
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Request Status
                          </p>
                          <div
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                              request.status === "Pending"
                                ? "bg-warning/20 text-warning"
                                : request.status === "Accepted"
                                  ? "bg-success/20 text-success"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {request.status === "Pending"
                              ? "⏳ Awaiting Approval"
                              : request.status === "Accepted"
                                ? "✓ Approved"
                                : request.status}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link to={`/food/${request.post.id}`}>
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full text-destructive hover:text-destructive"
                          >
                            Cancel Request
                          </Button>
                        </div>

                        {request.status === "Accepted" && (
                          <div className="bg-success/10 text-success rounded-lg p-3 text-xs font-medium">
                            <MessageSquare className="h-4 w-4 inline mr-1" />
                            Contact donor to arrange pickup
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ) : null
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <Card className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      Fresh Tomatoes
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      From Raj Kumar
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-success/20 text-success">
                      ✓ Completed
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Picked up 2024-12-10
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      Organic Apples
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      From Maya Gurung
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-success/20 text-success">
                      ✓ Completed
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Picked up 2024-12-08
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Saved Listings */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <Card className="p-12 text-center border-border border-dashed">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No saved listings yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Save your favorite donations to request later
                </p>
                <Link to="/browse">
                  <Button>Browse Food Donations</Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
