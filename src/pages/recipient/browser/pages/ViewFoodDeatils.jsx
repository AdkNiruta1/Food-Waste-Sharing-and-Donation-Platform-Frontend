import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Package,
  Star,
  ArrowLeft,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { useGetFoodDetails } from "../hooks/useGetFoodDetails";
import { IMAGE_URL } from "../../../../constants/constants";

export default function FoodDetail() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const { foods: post, loading, FoodDonationDeatils } = useGetFoodDetails();

  useEffect(() => {
    FoodDonationDeatils(foodId);
  }, [foodId]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!post) {
    return <p className="text-center mt-20">Food not found</p>;
  }


  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md border-slate-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Donation Not Found
            </h2>
            <Button
              onClick={() => navigate("/browse")}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Browse
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const today = new Date("2026-01-03"); // Current date: January 03, 2026
  const daysUntilExpiry = Math.ceil(
    (new Date(post.expiryDate) - today) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 1;

  const handleRequest = (e) => {
    e.preventDefault();
    alert(`Request sent for "${post.title}"! The donor will be notified.`);
    setShowRequestForm(false);
    setRequestMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Back Button */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto max-w-6xl px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column - Image & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Large Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={IMAGE_URL + post.photo || "https://via.placeholder.com/1200x600?text=No+Image"}
                alt={post.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <span className="inline-block px-5 py-3 bg-green-600 text-white rounded-full text-lg font-bold shadow-lg">
                  Available
                </span>
                {isExpiringSoon && (
                  <span className="inline-block px-5 py-3 bg-red-600 text-white rounded-full text-lg font-bold shadow-lg">
                    Expires {daysUntilExpiry === 0 ? "Today" : "Soon"}
                  </span>
                )}
              </div>
            </div>

            {/* Food Details */}
            <Card className="p-8 border-slate-200">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    {post.title}
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-slate-600 mb-2">Quantity</p>
                    <p className="text-3xl font-bold text-green-600">
                      {post.quantity}
                    </p>
                    <p className="text-sm text-slate-600">{post.unit}</p>
                  </div>
                  <div className="p-5 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-sm text-slate-600 mb-2">Best Before</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {new Date(post.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-600">
                      {isExpiringSoon ? "Urgent" : `${daysUntilExpiry} days left`}
                    </p>
                  </div>
                  <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-slate-600 mb-2">Requests</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {/* {post.requests.length} */}
                    </p>
                    <p className="text-sm text-slate-600">interested</p>
                  </div>
                  <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-sm text-slate-600 mb-2">Posted</p>
                    <p className="text-xl font-bold text-purple-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Pickup Instructions */}
                <div className="pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <Clock className="h-7 w-7 text-green-600" />
                    Pickup Instructions
                  </h2>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      {post.pickupInstructions || "Contact the donor for pickup details after your request is accepted."}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <MapPin className="h-7 w-7 text-green-600" />
                    Pickup Location
                  </h2>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="font-medium text-slate-900 mb-2">
                      {post.address || "Address provided upon request approval"}
                    </p>
                    <p className="text-slate-600">
                      {post.city}, {post.district}
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4 w-full border-slate-300">
                    View on Map (Coming Soon)
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Donor & Request */}
          <div className="space-y-8">
            <Card className="p-8 border-slate-200 sticky top-24">
              <div className="space-y-8">
                {/* Donor Info */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Donated By
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {post?.donor?.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(5)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-slate-300"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-slate-900">
                          {5}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm mt-6 pt-6 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Donations</span>
                      <span className="font-semibold text-green-600">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Member Since</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(post?.donor?.createdAt).toLocaleDateString()}
                      </span>

                    </div>
                  </div>
                </div>

                {/* Request Section */}
                <div className="pt-6 border-t border-slate-200">
                  {!showRequestForm ? (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-7"
                      disabled={post.status !== "available"}
                      onClick={() => setShowRequestForm(true)}
                    >
                      {post.status === "available" ? (
                        <>Request This Food</>
                      ) : (
                        <>Currently Unavailable</>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-base font-medium text-slate-900 mb-3">
                          Message to Donor (Optional)
                        </label>
                        <textarea
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          placeholder="Tell the donor why you need this food and when you can pick it up..."
                          className="w-full p-4 rounded-lg border border-slate-300 bg-white text-slate-900 resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          rows={5}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-slate-300"
                          onClick={() => {
                            setShowRequestForm(false);
                            setRequestMessage("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRequest}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Send Request
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pending Requests Notice */}
                {/* {post.requests.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 text-center">
                    <p className="text-sm font-medium text-orange-700 mb-1">
                      {post.requests.length} pending request{post.requests.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-orange-600">
                      Donor will choose who to accept
                    </p>
                  </div>
                )} */}

                {/* Contact Button */}
                <Button variant="outline" className="w-full border-slate-300">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message Donor (After Approval)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}