import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import {
  MapPin,
  Clock,
  ArrowLeft,
  MessageSquare,
  User,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useAuth } from "../../../../context/AuthContext";
import { useGetFoodRequestDetails } from "../hooks/useGetFoodRequestDetails";
import { useCancelFoodRequest } from "../hooks/useCancelFoodRequest";

export default function FoodDetailViewer() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { foods: post, loading, FoodRequestDetails } = useGetFoodRequestDetails();
  const { cancelFoodRequest,
    loading: cancelLoading,
    error, } = useCancelFoodRequest();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    FoodRequestDetails(foodId);
  }, [foodId]);

  const requests = post?.requests || [];
  const requestCount = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "pending");

  const userRequest = requests.find(
    (r) => r?.receiver?._id === currentUser?._id
  );
  const alreadyRequested = !!userRequest && userRequest.status !== "cancelled";
  const isRejected = userRequest?.status === "rejected";

  const [myLocation, setMyLocation] = useState(null);
  const donorLat = post?.foodPost?.lat;
  const donorLng = post?.foodPost?.lng;

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setMyLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geo error", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
  if (!donorLat || !donorLng) return null;
  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!post)
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



  const handleRequest = (e) => {
    e.preventDefault();
    cancelFoodRequest({ "requestId": post?.foodPost?._id });
  };
  const today = new Date("2026-01-03");
  const daysUntilExpiry = Math.ceil(
    (new Date(post?.foodPost?.expiryDate) - today) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 1;
  return (
    loading ? (<p className="text-center mt-20">Loading...</p>
    ) : (
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
        <div className="flex-1  mx-auto max-w-6xl px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={IMAGE_URL + post?.foodPost?.photo || "https://via.placeholder.com/1200x600?text=No+Image"}
                  alt={post?.foodPost?.title}
                  className="w-full h-96 md:h-125 object-cover"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  <span className="inline-block px-5 py-3 bg-green-600 text-white rounded-full text-lg font-bold shadow-lg">
                    {post?.foodPost?.status}
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{post?.foodPost?.title}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed">{post?.foodPost?.description}</p>
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-sm text-slate-600 mb-2">Quantity</p>
                      <p className="text-3xl font-bold text-green-600">{post?.foodPost?.quantity}</p>
                      <p className="text-sm text-slate-600">{post?.foodPost?.unit}</p>
                    </div>
                    <div className="p-5 bg-orange-50 rounded-xl border border-orange-200">
                      <p className="text-sm text-slate-600 mb-2">Best Before</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {new Date(post?.foodPost?.expiryDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-600">
                        {isExpiringSoon ? "Urgent" : `${daysUntilExpiry} days left`}
                      </p>
                    </div>
                    <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="text-sm text-slate-600 mb-2">Posted</p>
                      <p className="text-xl font-bold text-purple-600">
                        {new Date(post?.foodPost?.createdAt).toLocaleDateString()}
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
                      <p className="text-slate-700 leading-relaxed">{post?.foodPost?.pickupInstructions}</p>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                      <MapPin className="h-7 w-7 text-green-600" />
                      Pickup Location
                    </h2>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                      <p className="font-medium text-slate-900">
                        {post?.foodPost?.address}
                      </p>

                      <p className="text-slate-600">
                        {post?.foodPost?.city}, {post?.foodPost?.district}
                      </p>

                      {/* Embedded donor pickup map */}
                      <iframe
                        title="Pickup Location Map"
                        width="100%"
                        height="300"
                        loading="lazy"
                        allowFullScreen
                        className="rounded-xl"
                        src={`https://www.google.com/maps?q=${donorLat},${donorLng}&z=15&output=embed`}
                      />

                      {/* Pathao-style real navigation */}
                      <a
                        href={
                          myLocation
                            ? `https://www.google.com/maps/dir/?api=1&origin=${myLocation[0]},${myLocation[1]}&destination=${donorLat},${donorLng}&travelmode=driving`
                            : `https://www.google.com/maps/search/?api=1&query=${donorLat},${donorLng}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                          🚗 Navigate in Google Maps
                        </Button>
                      </a>

                      {!myLocation && (
                        <p className="text-sm text-orange-600 text-center">
                          Waiting for your live location to enable navigation...
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Donor Info & Actions */}
            <div className="space-y-8">
              <Card className="p-8 border-slate-200 sticky top-24">
                <div className="space-y-6">
                  {/* Donor Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Donated By</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        {post?.foodPost?.donor?.profilePicture ? (
                          <img
                            src={IMAGE_URL + post?.foodPost?.donor?.profilePicture}
                            alt={post?.foodPost?.donor?.name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 text-green-600" />
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{post?.foodPost?.donor?.name}</h2>
                        <p className="text-sm text-slate-600">{post?.foodPost?.donor?.email}</p>
                      </div>
                    </div>

                    {/* Contact / Rejected */}
                    <div className="space-y-3">
                      {isRejected && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <p className="text-red-700 font-medium">Your request was rejected</p>
                        </div>
                      )}
                      <a href={`tel:${post?.foodPost?.donor?.phone}`}>
                        <Button variant="secondary" className="w-full">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Contact Donor
                        </Button>
                      </a>
                    </div>

                    {/* Request / Already Requested */}
                    <div className="mt-4">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-5"
                        variant="default"
                        disabled={post?.foodPost?.status !== "available" || alreadyRequested || isRejected}
                        onClick={handleRequest}
                      >
                        {alreadyRequested
                          ? "Already Cancelled"
                          : cancelLoading
                            ? "Cancelling..."
                            : "Cancel Request"}
                      </Button>
                      {error && (<div className="text-red-600 text-sm mt-2 text-center">{error}</div>)}
                    </div>
                  </div>

                  {/* Pending Requests */}
                  {requestCount > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 text-center">
                      <p className="text-sm font-medium text-orange-700 mb-1">
                        {pendingRequests.length} pending request{pendingRequests.length !== 1 && "s"}
                      </p>
                      <p className="text-xs text-orange-600">Donor will choose who to accept</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
