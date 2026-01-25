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
  CheckCircle,
  Calendar,
  Navigation,
  Phone,
  Shield,
  Truck,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetFoodRequestDetails } from "../hooks/useGetFoodRequestDetails";
import { useCancelFoodRequest } from "../hooks/useCancelFoodRequest";

export default function FoodDetailViewer() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { foods: post, loading, FoodRequestDetails } = useGetFoodRequestDetails();
  const { 
    cancelFoodRequest,
    loading: cancelLoading,
    error: cancelError 
  } = useCancelFoodRequest();

  const [myLocation, setMyLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    FoodRequestDetails(foodId);
  }, [foodId]);

  // Get donor coordinates
  const donorLat = post?.foodPost?.lat;
  const donorLng = post?.foodPost?.lng;

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
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

  // Calculate days until expiry
  const calculateDaysUntilExpiry = () => {
    if (!post?.foodPost?.expiryDate) return null;
    const today = new Date();
    const expiryDate = new Date(post.foodPost.expiryDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = calculateDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 1 && daysUntilExpiry >= 0;
  const isExpired = daysUntilExpiry < 0;

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClass = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold";
    
    switch(status?.toLowerCase()) {
      case "pending":
        return `${baseClass} bg-orange-100 text-orange-700 border border-orange-200`;
      case "accepted":
        return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-700 border border-green-200`;
      case "cancelled":
        return `${baseClass} bg-red-100 text-red-700 border border-red-200`;
      case "rejected":
        return `${baseClass} bg-gray-100 text-gray-700 border border-gray-200`;
      case "available":
        return `${baseClass} bg-emerald-100 text-emerald-700 border border-emerald-200`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case "pending":
        return "⏳ Awaiting Approval";
      case "accepted":
        return "✓ Approved – Ready for Pickup";
      case "completed":
        return "✅ Successfully Received";
      case "cancelled":
        return "❌ Cancelled";
      case "rejected":
        return "⛔ Donor Rejected";
      case "available":
        return "📦 Available";
      default:
        return status;
    }
  };

  const handleCancelRequest = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to cancel this request?")) {
      setIsNavigating(true);
      try {
        await cancelFoodRequest({ requestId: post?._id });
        setTimeout(() => {
          navigate("/recipient/dashboard");
        }, 1500);
      } catch (err) {
        console.error(err);
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const handleNavigateToMaps = () => {
    if (!myLocation || !donorLat || !donorLng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${donorLat},${donorLng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${myLocation[0]},${myLocation[1]}&destination=${donorLat},${donorLng}&travelmode=driving`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex-1 flex items-center justify-center py-20">
            <Card className="p-12 text-center max-w-md border-slate-200 shadow-lg">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Donation Not Found
              </h2>
              <p className="text-slate-600 mb-8">
                The donation you're looking for doesn't exist or has been removed.
              </p>
              <Button
                onClick={() => navigate("/food-browse")}
                className="bg-green-600 hover:bg-green-700"
              >
                Browse Available Food
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with Back Button */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </Button>
            
            <div className="text-right">
              <div className={getStatusBadge(post?.status)}>
                <span className="text-lg">{getStatusText(post?.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Food Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Food Image with Badges */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src={post?.foodPost?.photo 
                  ? IMAGE_URL + post.foodPost.photo 
                  : "https://via.placeholder.com/1200x600?text=No+Image"}
                alt={post?.foodPost?.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Status Badges Overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <div className={getStatusBadge(post?.foodPost?.status)}>
                  <span className="text-lg font-bold">{getStatusText(post?.foodPost?.status)}</span>
                </div>
                
                {isExpiringSoon && !isExpired && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full text-lg font-bold shadow-lg">
                    <Clock className="h-5 w-5" />
                    <span>Expires {daysUntilExpiry === 0 ? "Today" : "Tomorrow"}</span>
                  </div>
                )}
                
                {isExpired && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-lg font-bold shadow-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span>Expired</span>
                  </div>
                )}
              </div>
            </div>

            {/* Food Details Card */}
            <Card className="p-8 border-slate-200 shadow-sm">
              <div className="space-y-8">
                {/* Title & Description */}
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">{post?.foodPost?.title}</h1>
                  <p className="text-lg text-slate-600 leading-relaxed">{post?.foodPost?.description}</p>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-slate-600 mb-2">Quantity</p>
                    <p className="text-3xl font-bold text-green-600">{post?.foodPost?.quantity}</p>
                    <p className="text-sm text-slate-600 capitalize">{post?.foodPost?.unit}</p>
                  </div>
                  
                  <div className={`p-5 rounded-xl border ${isExpiringSoon || isExpired ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
                    <p className="text-sm text-slate-600 mb-2">Best Before</p>
                    <p className={`text-2xl font-bold ${isExpiringSoon || isExpired ? 'text-orange-600' : 'text-blue-600'}`}>
                      {new Date(post?.foodPost?.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-600">
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Urgent' : `${daysUntilExpiry} days left`}
                    </p>
                  </div>
                  
                  <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-sm text-slate-600 mb-2">Food Type</p>
                    <p className="text-2xl font-bold text-purple-600 capitalize">{post?.foodPost?.type}</p>
                  </div>
                  
                  <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm text-slate-600 mb-2">Donor Rating</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <p className="text-2xl font-bold text-yellow-600">
                        {post?.foodPost?.donor?.rating || 'N/A'}
                      </p>
                    </div>
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

                {/* Location & Navigation */}
                <div className="pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <MapPin className="h-7 w-7 text-green-600" />
                    Pickup Location
                  </h2>
                  
                  <Card className="border-slate-200 overflow-hidden">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {post?.foodPost?.city}, {post?.foodPost?.district}
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            Exact address shared after acceptance
                          </p>
                        </div>
                      </div>

                      {/* Google Maps Embed */}
                      {donorLat && donorLng && (
                        <>
                          <div className="rounded-xl overflow-hidden border border-slate-200">
                            <iframe
                              title="Pickup Location Map"
                              width="100%"
                              height="300"
                              loading="lazy"
                              allowFullScreen
                              className="border-0"
                              src={`https://www.google.com/maps?q=${donorLat},${donorLng}&z=15&output=embed`}
                            />
                          </div>

                          {/* Navigation Button */}
                          <Button
                            onClick={handleNavigateToMaps}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                            disabled={isNavigating}
                          >
                            <Navigation className="mr-3 h-6 w-6" />
                            {isNavigating ? 'Opening Maps...' : 'Navigate with Google Maps'}
                          </Button>

                          {!myLocation && (
                            <p className="text-sm text-orange-600 text-center">
                              <Clock className="h-4 w-4 inline mr-1" />
                              Waiting for your location to enable turn-by-turn navigation
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Donor Info & Actions */}
          <div className="space-y-8">
            {/* Donor Information Card */}
            <Card className="p-8 border-slate-200 shadow-sm sticky top-24">
              <div className="space-y-8">
                {/* Donor Profile */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b border-slate-200">
                    Donated By
                  </h3>
                  
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-6">
                      {post?.foodPost?.donor?.profilePicture ? (
                        <img
                          src={IMAGE_URL + post.foodPost.donor.profilePicture}
                          alt={post.foodPost.donor.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-green-600" />
                      )}
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {post?.foodPost?.donor?.name}
                      </h2>
                      
                      {post?.foodPost?.donor?.rating && (
                        <div className="flex items-center justify-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(post.foodPost.donor.rating)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-slate-600">
                            ({post.foodPost.donor.rating})
                          </span>
                        </div>
                      )}
                      
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                        <Shield className="h-4 w-4" />
                        Verified Donor
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Phone Number</p>
                        <p className="font-medium text-slate-900">
                          {post?.foodPost?.donor?.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Requested On</p>
                        <p className="font-medium text-slate-900">
                          {new Date(post?.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <a href={`tel:${post?.foodPost?.donor?.phone}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 mb-4">
                      <MessageSquare className="mr-3 h-5 w-5" />
                      Contact Donor
                    </Button>
                  </a>
                </div>

                {/* Request Status & Actions */}
                <div className="pt-8 border-t border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Your Request</h4>
                  
                  {/* Status Info */}
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-600">Status:</span>
                      <div className={getStatusBadge(post?.status)}>
                        {getStatusText(post?.status)}
                      </div>
                    </div>
                    
                    {post?.acceptedAt && (
                      <p className="text-sm text-slate-600">
                        Accepted on: {new Date(post.acceptedAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    {post?.completedAt && (
                      <p className="text-sm text-slate-600">
                        Completed on: {new Date(post.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {post?.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 py-6"
                          onClick={handleCancelRequest}
                          disabled={cancelLoading}
                        >
                          {cancelLoading ? "Cancelling..." : "Cancel Request"}
                        </Button>
                        
                        {cancelError && (
                          <p className="text-sm text-red-600 text-center">{cancelError}</p>
                        )}
                      </>
                    )}
                    
                    {post?.status === "accepted" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Truck className="h-6 w-6 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-700 mb-2">
                              Your request has been accepted!
                            </p>
                            <p className="text-sm text-green-600">
                              Contact the donor to coordinate pickup time and location.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {post?.status === "completed" && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-emerald-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-emerald-700 mb-2">
                              Successfully received!
                            </p>
                            <p className="text-sm text-emerald-600">
                              Thank you for participating in food sharing.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}