import { useEffect, useState } from "react";
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
import { useGetDonationHistory } from "../hooks/useGetDonationHistory";
import { IMAGE_URL } from "../../../../constants/constants";

export default function DonationHistory() {
  const navigate = useNavigate();
  const [showCancelMessage, setShowCancelMessage] = useState(null);
  const [cancelMessage, setCancelMessage] = useState("");
  const { foods, loading, error, fetchDonationHistory, } = useGetDonationHistory();
  const AllDonations = foods.filter((d) => d.status === "accepted" || d.status === "completed" || d.status === "expired");
  const completedDonations = foods.filter((d) => d.status === "completed");
  const expiredDonations = foods.filter((d) => d.status === "expired");
  const acceptedDonations = foods.filter((d) => d.status === "accepted");

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const handleRateRecipient = (id) => {
    navigate(`/donation-history/recipient/rating/${id}`);
  };

  const handleViewRecipient = (id) => {
    navigate(`/donation-history/recipient/${id}`);
  };

  const handleSubmitCancelMessage = () => {
    if (cancelMessage.trim()) {
      alert("Your message has been sent to the recipient.");
      setCancelMessage("");
      setShowCancelMessage(null);
    }
  };

  const renderDonationCard = (donation) => (
    <Card
      key={donation.id}
      className="p-6 md:p-8 border border-slate-200 hover:shadow-lg transition-shadow"
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Image */}
        <div className="lg:col-span-1">
          <img
            src={IMAGE_URL +  donation?.photo}
            alt={donation?.title}
            className="w-full h-48 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {donation?.title}
            </h3>
            <p className="text-slate-600 mt-2">
              {donation?.description}
            </p>
          </div>

          {/* Recipient Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              {donation?.acceptedRequest?.receiver?.profilePicture ? (
                <img
                  src={IMAGE_URL + donation?.acceptedRequest?.receiver?.profilePicture}
                  alt={donation?.acceptedRequest?.receiver?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-green-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-600">Received by</p>
              <button
                onClick={() => handleViewRecipient(donation?.acceptedRequest?.receiver?._id)}
                className="font-semibold text-lg text-slate-900 hover:text-green-600 transition-colors"
              >
                {donation.acceptedRequest?.receiver?.name}
              </button>
              {donation?.rating && (
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(donation?.rating?.value)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-slate-300"
                        }`}
                    />
                  ))}
                  <span className="ml-2 font-medium text-slate-900">
                    {donation?.rating?.value.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-slate-600 mb-1">Quantity</p>
              <p className="font-semibold text-slate-900">
                {donation?.quantity} {donation?.unit}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Donated</p>
              <p className="font-semibold text-slate-900">
                {new Date(donation?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${donation?.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : donation?.status === "expired"
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-yellow-600"
                  }`}
              >
                {donation?.status.charAt(0).toUpperCase() + donation?.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Your Rating (if completed) */}
          {donation?.status === "completed" && donation?.rating && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700 mb-2">
                Your Rating
              </p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < donation?.rating?.value
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-slate-300"
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-700 mt-2">
                "{donation?.rating?.comment}"
              </p>
            </div>
          )}

          
        </div>

        {/* Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className={`p-4 rounded-xl text-center font-semibold text-lg ${donation?.status === "completed"
              ? "bg-green-100 text-green-700"
              : donation?.status === "expired"
                ? "bg-red-100 text-red-700"
                : "bg-orange-100 text-orange-700"
              }`}
          >
            {donation?.status === "completed" && <CheckCircle className="h-8 w-8 mx-auto mb-2" />}
            {donation?.status === "accepted" && <Clock className="h-8 w-8 mx-auto mb-2" />}
            {donation?.status === "expired" && <XCircle className="h-8 w-8 mx-auto mb-2" />}
            {donation?.status.charAt(0).toUpperCase() + donation?.status.slice(1)}
          </div>

          {donation?.status === "completed" && donation?.rating && (
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              onClick={() => handleRateRecipient(donation?._id)}
            >
              <Star className="mr-2 h-5 w-5" />
              Rate Recipient
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full border-slate-300"
            onClick={() => handleViewRecipient(donation?.acceptedRequest?.receiver?._id)}
          >
            <User className="mr-2 h-5 w-5" />
            View Recipient Profile
          </Button>

          {donation.status === "available" && (
            <Button
              variant="outline"
              className="w-full border-slate-300"
              onClick={() => setShowCancelMessage(donation._id)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Send Message
            </Button>
          )}
        </div>
      </div>

      {/* Message Form for available Donations */}
      {showCancelMessage === donation.id && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Send a message to the recipient (optional)
          </label>
          <textarea
            placeholder="Let them know you're still interested or ask questions..."
            value={cancelMessage}
            onChange={(e) => setCancelMessage(e.target.value)}
            className="w-full p-4 rounded-lg border border-slate-300 bg-white text-slate-900 resize-none focus:ring-2 focus:ring-green-600"
            rows={4}
          />
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => handleSubmitCancelMessage(donation.id)}
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
    loading ? (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-600">Loading your donation history...</p>
      </div>
    ) : error ? (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <h2 className="text-xl font-bold mb-4">Error Loading Donation History</h2>
          <p className="text-red-600 mb-4">{error}</p>
        </Card>
      </div>
    ) : (

    <div className="min-h-screen flex flex-col bg-white">

      {/* Page Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center gap-5">
            <Package className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                My Donation History
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Track all your food donations — from accepted to completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-10 bg-slate-100">
            <TabsTrigger value="all">
              All ({AllDonations.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedDonations.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedDonations.length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Expired ({expiredDonations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {foods.length === 0  ? (
              <Card className="p-20 text-center border-slate-200">
                <Package className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No donations yet
                </h3>
                <p className="text-slate-600 mb-8">
                  Start sharing surplus food and make a difference in your community.
                </p>
                <Link to="/create-food">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Post Your First Donation
                  </Button>
                </Link>
              </Card>
            ) : (
              AllDonations.map(renderDonationCard)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-8">
            {completedDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <CheckCircle className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No completed donations yet
                </p>
              </Card>
            ) : (
              completedDonations.map(renderDonationCard)
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-8">
            {acceptedDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <Clock className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No accepted donations
                </p>
              </Card>
            ) : (
              acceptedDonations.map(renderDonationCard)
            )}
          </TabsContent>
          <TabsContent value="expired" className="space-y-8">
            {expiredDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200">
                <XCircle className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <p className="text-lg text-slate-600">
                  No expired donations
                </p>
              </Card>
            ) : (
              expiredDonations.map(renderDonationCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    )
  );
}