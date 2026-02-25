import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  Award,
  Eye,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { useGetDonationHistory } from "../hooks/useGetDonationHistory";
import { IMAGE_URL } from "../../../../constants/constants";
import { RatingPopup } from "./DonorRatingPage";
import { ViewRecipientPopup } from "./ViewRecipientProfile";
import { ViewDetailsPopup } from "./ViewDonationDetails";
import { useCreateRating } from "../../../recipient/RequestFood/hooks/useCreateRating";

export default function DonationHistory() {
  const [showCancelMessage, setShowCancelMessage] = useState(null);
  const [cancelMessage, setCancelMessage] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [showRecipientPopup, setShowRecipientPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const { foods, loading, error, fetchDonationHistory } = useGetDonationHistory();
  const { createRating, loading: ratingLoading, error: ratingError } = useCreateRating();

  const AllDonations = foods.filter((d) => d.status === "accepted" || d.status === "completed" || d.status === "expired");
  const completedDonations = foods.filter((d) => d.status === "completed");
  const expiredDonations = foods.filter((d) => d.status === "expired");
  const acceptedDonations = foods.filter((d) => d.status === "accepted");

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const handleRateRecipient = (donation) => {
    setSelectedDonation(donation);
    setShowRatingPopup(true);
  };

  const handleViewRecipient = (recipientId) => {
    setSelectedRecipientId(recipientId);
    setShowRecipientPopup(true);
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setShowDetailsPopup(true);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      await createRating(ratingData);
      fetchDonationHistory();
      setShowRatingPopup(false);
      setSelectedDonation(null);
    } catch (err) {
      console.error("Rating submission failed:", err);
    }
  };

  const handleSubmitCancelMessage = () => {
    if (cancelMessage.trim()) {
      alert("Your message has been sent to the recipient.");
      setCancelMessage("");
      setShowCancelMessage(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-linear-to-r from-emerald-500 to-emerald-600';
      case 'accepted': return 'bg-linear-to-r from-blue-500 to-blue-600';
      case 'expired': return 'bg-linear-to-r from-rose-500 to-rose-600';
      case 'available': return 'bg-linear-to-r from-amber-500 to-amber-600';
      default: return 'bg-linear-to-r from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'accepted': return <Clock className="h-5 w-5" />;
      case 'expired': return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= (rating || 0)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      );
    }
    return stars;
  };

  const renderDonationCard = (donation) => (
    <Card
      key={donation._id}
      className="p-6 rounded-2xl border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group"
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Food Image */}
        <div className="lg:col-span-1">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 group-hover:border-emerald-200 transition-colors">
            <img
              src={IMAGE_URL + donation?.photo}
              alt={donation?.title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge className={`${getStatusColor(donation?.status)} text-white shadow-lg`}>
                {getStatusIcon(donation?.status)}
                <span className="ml-1">{donation?.status?.charAt(0).toUpperCase() + donation?.status?.slice(1)}</span>
              </Badge>
            </div>
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/60">
                {donation?.quantity} {donation?.unit}
              </Badge>
            </div>
          </div>
        </div>

        {/* Food Details */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer">
              {donation?.title}
            </h3>
            <p className="text-slate-600 mt-2 line-clamp-2">
              {donation?.description}
            </p>
          </div>

          {/* Recipient Info */}
          {donation?.acceptedRequest?.receiver && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-slate-50/80 to-slate-100/60 border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
              <div className="relative">
                {donation?.acceptedRequest?.receiver?.profilePicture ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-200 group-hover:border-emerald-300 transition-colors">
                    <img
                      src={IMAGE_URL + donation.acceptedRequest.receiver.profilePicture}
                      alt={donation.acceptedRequest.receiver.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-linear-to-r from-emerald-100 to-emerald-200 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all">
                    <User className="h-7 w-7 text-emerald-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Received by</p>
                    <button
                      onClick={() => handleViewRecipient(donation?.acceptedRequest?.receiver?._id)}
                      className="font-bold text-lg text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1"
                    >
                      {donation.acceptedRequest?.receiver?.name}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                  {donation?.acceptedRequest?.receiver?.rating && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {renderStars(donation.acceptedRequest.receiver.rating)}
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {donation.acceptedRequest.receiver.rating?.toFixed(1) || "0.0"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-linear-to-br from-slate-50/80 to-white border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
              <p className="text-xs text-slate-500 mb-1">Quantity</p>
              <p className="font-bold text-slate-900">
                {donation?.quantity} {donation?.unit}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-linear-to-br from-slate-50/80 to-white border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
              <p className="text-xs text-slate-500 mb-1">Donated</p>
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(donation?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-linear-to-br from-slate-50/80 to-white border border-slate-200/60 hover:border-emerald-200/60 transition-colors">
              <p className="text-xs text-slate-500 mb-1">Location</p>
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {donation?.city || "Not specified"}
              </p>
            </div>
          </div>

          {/* Your Rating (if completed) */}
          {donation?.status === "completed" && donation?.rating && (
            <div className="p-4 rounded-xl bg-linear-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">Your Rating</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(donation?.rating?.value)}
              </div>
              {donation?.rating?.comment && (
                <p className="text-sm text-slate-700">
                  "{donation?.rating?.comment}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-1 space-y-3">
          {donation?.status === "completed" && (
            <Button
              onClick={() => handleRateRecipient(donation)}
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all"
            >
              <Star className="mr-2 h-4 w-4" />
              Rate Recipient
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => handleViewRecipient(donation?.acceptedRequest?.receiver?._id)}
            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
            disabled={!donation?.acceptedRequest?.receiver}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Button>

          {donation.status === "accepted" && (
            <Button
              variant="outline"
              className="w-full border-slate-300 hover:border-slate-400 transition-all"
              onClick={() => setShowCancelMessage(donation._id)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-all"
            onClick={() => handleViewDetails(donation)}
          >
            <Info className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>

      {/* Message Form for accepted Donations */}
      {showCancelMessage === donation._id && (
        <div className="mt-6 pt-6 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Send a message to the recipient
          </label>
          <textarea
            placeholder="Let them know you're still interested or ask questions..."
            value={cancelMessage}
            onChange={(e) => setCancelMessage(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300/80 bg-white text-slate-900 resize-none focus:border-emerald-400 focus:ring-emerald-400/20 transition-colors"
            rows={3}
          />
          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleSubmitCancelMessage}
              className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
            >
              Send Message
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-slate-300 hover:border-slate-400"
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading donation history...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching your generous contributions</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <XCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading History</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button
            onClick={fetchDonationHistory}
            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-200/60">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  My Donation History
                </h1>
                <p className="text-lg text-slate-600 mt-2">
                  Track all your food donations and their impact
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/create-food">
                <Button className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20">
                  <Package className="mr-2 h-4 w-4" />
                  New Donation
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={fetchDonationHistory}
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-10 bg-slate-100/80 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger 
              value="all" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60"
            >
              All ({AllDonations.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60"
            >
              Completed ({completedDonations.length})
            </TabsTrigger>
            <TabsTrigger 
              value="accepted"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60"
            >
              Accepted ({acceptedDonations.length})
            </TabsTrigger>
            <TabsTrigger 
              value="expired"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60"
            >
              Expired ({expiredDonations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {AllDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-linear-to-br from-slate-50 to-white">
                <div className="p-6 rounded-2xl bg-slate-100/80 inline-flex mb-6">
                  <Package className="h-20 w-20 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No donations yet
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Start sharing surplus food and make a meaningful impact in your community.
                  Your generosity can feed someone in need today.
                </p>
                <Link to="/create-food">
                  <Button size="lg" className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20">
                    <Package className="mr-2 h-5 w-5" />
                    Post Your First Donation
                  </Button>
                </Link>
              </Card>
            ) : (
              AllDonations.map(renderDonationCard)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {completedDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-linear-to-br from-slate-50 to-white">
                <div className="p-6 rounded-2xl bg-emerald-100/80 inline-flex mb-6">
                  <CheckCircle className="h-20 w-20 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No completed donations yet
                </h3>
                <p className="text-slate-600">
                  Your accepted donations will appear here once they're completed
                </p>
              </Card>
            ) : (
              completedDonations.map(renderDonationCard)
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {acceptedDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-linear-to-br from-slate-50 to-white">
                <div className="p-6 rounded-2xl bg-blue-100/80 inline-flex mb-6">
                  <Clock className="h-20 w-20 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No accepted donations
                </h3>
                <p className="text-slate-600">
                  Donations accepted by recipients will appear here
                </p>
              </Card>
            ) : (
              acceptedDonations.map(renderDonationCard)
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {expiredDonations.length === 0 ? (
              <Card className="p-16 text-center border-slate-200/80 rounded-2xl bg-linear-to-br from-slate-50 to-white">
                <div className="p-6 rounded-2xl bg-rose-100/80 inline-flex mb-6">
                  <XCircle className="h-20 w-20 text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No expired donations
                </h3>
                <p className="text-slate-600">
                  All your donations are currently active
                </p>
              </Card>
            ) : (
              expiredDonations.map(renderDonationCard)
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Popup */}
      {selectedDonation && (
        <RatingPopup
          isOpen={showRatingPopup}
          onClose={() => {
            setShowRatingPopup(false);
            setSelectedDonation(null);
          }}
          onSubmit={handleSubmitRating}
          loading={ratingLoading}
          error={ratingError}
          post={selectedDonation}
        />
      )}

      {/* Recipient Popup */}
      <ViewRecipientPopup
        isOpen={showRecipientPopup}
        onClose={() => {
          setShowRecipientPopup(false);
          setSelectedRecipientId(null);
        }}
        recipientId={selectedRecipientId}
      />

      {/* View Details Popup */}
      <ViewDetailsPopup
        isOpen={showDetailsPopup}
        onClose={() => {
          setShowDetailsPopup(false);
          setSelectedDonation(null);
        }}
        donation={selectedDonation}
        loading={false}
        error={null}
      />
    </div>
  );
}