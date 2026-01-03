import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  MessageSquare,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

const mockHistory = [
  {
    id: "1",
    foodTitle: "Fresh Tomatoes",
    foodDescription: "Freshly harvested organic tomatoes",
    foodImage: "https://images.unsplash.com/photo-1592924357615-5042d17241a1?w=400&h=300&fit=crop",
    donorName: "Raj Kumar",
    donorRating: 4.8,
    quantity: "10",
    unit: "kg",
    status: "completed",
    requestedAt: "2025-12-10T10:00:00Z",
    completedAt: "2025-12-10T15:30:00Z",
    rating: 5,
    review: "Excellent quality! Very satisfied with the donation.",
    donorId: "d1",
  },
  {
    id: "2",
    foodTitle: "Bakery Items",
    foodDescription: "Unsold bakery items from today",
    foodImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    donorName: "Priya Patel",
    donorRating: 4.9,
    quantity: "15",
    unit: "items",
    status: "completed",
    requestedAt: "2025-12-08T14:00:00Z",
    completedAt: "2025-12-08T18:00:00Z",
    rating: 4,
    review: "Good quality items, very helpful donor.",
    donorId: "d2",
  },
  {
    id: "3",
    foodTitle: "Milk & Dairy",
    foodDescription: "Fresh milk and paneer",
    foodImage: "https://images.unsplash.com/photo-1563636619-d0bb3b10af3f?w=400&h=300&fit=crop",
    donorName: "Suresh Nair",
    donorRating: 4.5,
    quantity: "5",
    unit: "liters",
    status: "accepted",
    requestedAt: "2025-12-05T08:00:00Z",
    donorId: "d5",
  },
  {
    id: "4",
    foodTitle: "Cooked Rice & Curry",
    foodDescription: "Home-cooked vegetable curry",
    foodImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    donorName: "Amit Singh",
    donorRating: 4.7,
    quantity: "5",
    unit: "portions",
    status: "cancelled",
    requestedAt: "2025-12-03T12:00:00Z",
    cancelReason: "Donor cancelled due to scheduling conflict",
    donorId: "d3",
  },
  {
    id: "5",
    foodTitle: "Organic Apples",
    foodDescription: "Fresh seasonal apples",
    foodImage: "https://images.unsplash.com/photo-1560807707-614bc9469f91?w=400&h=300&fit=crop",
    donorName: "Maya Gurung",
    donorRating: 4.6,
    quantity: "8",
    unit: "kg",
    status: "pending",
    requestedAt: "2025-12-01T09:00:00Z",
    donorId: "d4",
  },
];

export default function RequestHistory() {
  const navigate = useNavigate();
  const [showCancelMessage, setShowCancelMessage] = useState(null);
  const [cancelMessage, setCancelMessage] = useState("");

  const completedRequests = mockHistory.filter((r) => r.status === "completed");
  const acceptedRequests = mockHistory.filter((r) => r.status === "accepted");
  const pendingRequests = mockHistory.filter((r) => r.status === "pending");
  const cancelledRequests = mockHistory.filter((r) => r.status === "cancelled");

  const handleRateFood = (id) => {
    navigate(`/rate-food/${id}`);
  };

  const handleViewDonor = (donorId) => {
    navigate(`/profile/${donorId}`);
  };

  const handleSubmitCancelMessage = (id) => {
    if (cancelMessage.trim()) {
      alert("Your message has been sent to the donor.");
      setCancelMessage("");
      setShowCancelMessage(null);
    }
  };

  const renderRequestCard = (request) => (
    <Card
      key={request.id}
      className="p-6 md:p-8 border-slate-200 hover:shadow-lg transition-shadow"
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Image */}
        <div className="lg:col-span-1">
          <img
            src={request.foodImage}
            alt={request.foodTitle}
            className="w-full h-48 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {request.foodTitle}
            </h3>
            <p className="text-slate-600 mt-2">
              {request.foodDescription}
            </p>
          </div>

          {/* Donor Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Donated by</p>
              <button
                onClick={() => handleViewDonor(request.donorId)}
                className="font-semibold text-lg text-slate-900 hover:text-green-600 transition-colors"
              >
                {request.donorName}
              </button>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(request.donorRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-slate-300"
                    }`}
                  />
                ))}
                <span className="ml-2 font-medium text-slate-900">
                  {request.donorRating}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-slate-600 mb-1">Quantity</p>
              <p className="font-semibold text-slate-900">
                {request.quantity} {request.unit}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Requested</p>
              <p className="font-semibold text-slate-900">
                {new Date(request.requestedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Status</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                request.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : request.status === "accepted"
                  ? "bg-blue-100 text-blue-700"
                  : request.status === "pending"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Your Rating (if completed) */}
          {request.status === "completed" && request.rating && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700 mb-2">
                Your Review
              </p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < request.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-700 mt-2">
                "{request.review}"
              </p>
            </div>
          )}

          {/* Cancel Reason */}
          {request.status === "cancelled" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-700 mb-1">
                Cancelled
              </p>
              <p className="text-sm text-slate-700">
                {request.cancelReason}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`p-4 rounded-xl text-center font-semibold text-lg ${
            request.status === "completed"
              ? "bg-green-100 text-green-700"
              : request.status === "accepted"
              ? "bg-blue-100 text-blue-700"
              : request.status === "pending"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
          }`}>
            {request.status === "completed" && <CheckCircle className="h-8 w-8 mx-auto mb-2" />}
            {request.status === "accepted" && <CheckCircle className="h-8 w-8 mx-auto mb-2" />}
            {request.status === "pending" && <Clock className="h-8 w-8 mx-auto mb-2" />}
            {request.status === "cancelled" && <XCircle className="h-8 w-8 mx-auto mb-2" />}
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>

          {request.status === "completed" && !request.rating && (
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              onClick={() => handleRateFood(request.id)}
            >
              <Star className="mr-2 h-5 w-5" />
              Rate This Donation
            </Button>
          )}

          {(request.status === "accepted" || request.status === "pending") && (
            <Button
              variant="outline"
              className="w-full border-slate-300"
              onClick={() => handleViewDonor(request.donorId)}
            >
              <User className="mr-2 h-5 w-5" />
              View Donor Profile
            </Button>
          )}

          {request.status === "cancelled" && (
            <Button
              variant="outline"
              className="w-full border-slate-300"
              onClick={() => setShowCancelMessage(request.id)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Send Message
            </Button>
          )}
        </div>
      </div>

      {/* Message Form for Cancelled Requests */}
      {showCancelMessage === request.id && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Send a message to the donor (optional)
          </label>
          <textarea
            placeholder="Let the donor know you're still interested or ask questions..."
            value={cancelMessage}
            onChange={(e) => setCancelMessage(e.target.value)}
            className="w-full p-4 rounded-lg border border-slate-300 bg-white text-slate-900 resize-none focus:ring-2 focus:ring-green-600"
            rows={4}
          />
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => handleSubmitCancelMessage(request.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Send Message
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-slate-300"
              onClick={() => {
                setShowCancelMessage(null);
                setCancelMessage("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center gap-5">
            <Package className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                My Request History
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Track all your food requests — from pending to completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-10 bg-slate-100">
            <TabsTrigger value="all">
              All ({mockHistory.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {mockHistory.length === 0 ? (
              <Card className="p-20 text-center border-slate-200">
                <Package className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No requests yet
                </h3>
                <p className="text-slate-600 mb-8">
                  Start browsing available food and make your first request!
                </p>
                <Link to="/browse">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Browse Food Now
                  </Button>
                </Link>
              </Card>
            ) : (
              mockHistory.map(renderRequestCard)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-8">
            {completedRequests.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <CheckCircle className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No completed pickups yet
                </p>
              </Card>
            ) : (
              completedRequests.map(renderRequestCard)
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-8">
            {acceptedRequests.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <CheckCircle className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No accepted requests
                </p>
              </Card>
            ) : (
              acceptedRequests.map(renderRequestCard)
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-8">
            {pendingRequests.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <Clock className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No pending requests
                </p>
              </Card>
            ) : (
              pendingRequests.map(renderRequestCard)
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-8">
            {cancelledRequests.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <XCircle className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No cancelled requests
                </p>
              </Card>
            ) : (
              cancelledRequests.map(renderRequestCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}