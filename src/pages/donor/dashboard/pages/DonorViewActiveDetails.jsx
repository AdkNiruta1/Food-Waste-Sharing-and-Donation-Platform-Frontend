import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  User,
  Phone,
  Star,
  MapPin,
  Calendar,
  Package,
  Clock,
  Navigation,
  ArrowLeft,
  Mail,
  Shield,
  Award,
  Users,
  Truck,
  Heart,
  AlertCircle,
  RefreshCw,
  Share2,
  Eye,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Thermometer,
  Scale,
  Home,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetActiveDonationById } from "../hooks/useGetActiveDonationById";
import { useParams, useNavigate } from "react-router-dom";
import LiveRoute from "./Live";
import { IMAGE_URL } from "../../../../constants/constants";
import { useCompletePickup } from "../hooks/useCompletedPickUp";

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons
const donorIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const receiverIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function DonorViewRequestDetails() {
  const navigate = useNavigate();
  const { id: donationId } = useParams();
  const {
    foods: activeFoods,
    loading: activeLoading,
    error: activeError,
    fetchMyActiveDonationById,
  } = useGetActiveDonationById();

  const { completePickup, loading: completeLoading, error: completeError } = useCompletePickup();
  const [receiverPosition, setReceiverPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]); // Default to Kathmandu
  const [loading, setLoading] = useState(false);

  // Fetch donation details
  useEffect(() => {
    fetchMyActiveDonationById(donationId);
  }, [donationId]);

  // Donor (pickup) position
  const donorPosition = activeFoods?.foodPost?.lat && activeFoods?.foodPost?.lng
    ? [activeFoods.foodPost.lat, activeFoods.foodPost.lng]
    : null;

  // Update map center when positions are available
  useEffect(() => {
    if (donorPosition) {
      setMapCenter(donorPosition);
    }
  }, [donorPosition]);

  // WebSocket for LIVE receiver tracking
  useEffect(() => {
    if (!activeFoods?.foodPost?._id) return;

    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          userId: activeFoods.foodPost.donor._id || activeFoods.foodPost.donor,
          role: "donor",
          foodPostId: activeFoods.foodPost._id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "LIVE_LOCATION") {
          console.log("WS LIVE_LOCATION", data);
          setReceiverPosition([data.lat, data.lng]);
          
          // Update map center to show both markers
          if (donorPosition) {
            const centerLat = (data.lat + donorPosition[0]) / 2;
            const centerLng = (data.lng + donorPosition[1]) / 2;
            setMapCenter([centerLat, centerLng]);
          }
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      ws.close();
    };
  }, [activeFoods?.foodPost?._id, donorPosition]);

  const handleCompletePickup = async () => {
    try {
      setLoading(true);
      await completePickup({ requestId: donationId });
      // Show success and navigate after a delay
      setTimeout(() => {
        navigate('/donor-dashboard');
      }, 2000);
    } catch (err) {
      console.error("Complete pickup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (activeLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading request details...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching pickup information</p>
      </div>
    );
  }

  if (activeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Request</h2>
          <p className="text-slate-600 mb-6">{activeError}</p>
          <Button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(activeFoods?.foodPost?.expiryDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60 sticky top-0 z-40 backdrop-blur-lg">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-emerald-200/60"></div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Pickup Details</h1>
                <p className="text-slate-600">Live tracking and recipient information</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => fetchMyActiveDonationById(donationId)}
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Waiting for Pickup
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipient Information Card */}
            <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Recipient Information</h2>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src={IMAGE_URL + activeFoods?.receiver?.profilePicture}
                      alt={activeFoods?.receiver?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {activeFoods?.receiver?.accountVerified === "verified" && (
                    <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md">
                      <Shield className="h-4 w-4 text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{activeFoods?.receiver?.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-4 w-4" />
                          <span className="font-medium">{activeFoods?.receiver?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{activeFoods?.receiver?.email}</span>
                        </div>
                      </div>
                    </div>
                    {activeFoods?.receiver?.rating && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          {renderStars(activeFoods.receiver.rating)}
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {activeFoods.receiver.rating?.toFixed(1)} ({activeFoods.receiver.ratingCount} reviews)
                        </p>
                      </div>
                    )}
                  </div>
                  {activeFoods?.receiver?.address && (
                    <div className="flex items-center gap-2 mt-4 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{activeFoods.receiver.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Food Information Card */}
            <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Food Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                  <img
                    src={`${IMAGE_URL}${activeFoods?.foodPost?.photo}`}
                    alt={activeFoods?.foodPost?.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/60">
                      <Scale className="h-3 w-3 mr-1" />
                      {activeFoods?.foodPost?.quantity} {activeFoods?.foodPost?.unit}
                    </Badge>
                  </div>
                  {daysLeft <= 2 && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
                        <Thermometer className="h-3 w-3 mr-1" />
                        Expiring Soon
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{activeFoods?.foodPost?.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{activeFoods?.foodPost?.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(activeFoods?.foodPost?.expiryDate)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Days Left</p>
                      <p className={`font-bold flex items-center gap-1 ${
                        daysLeft <= 2 ? 'text-rose-600' :
                        daysLeft <= 7 ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        <Thermometer className="h-4 w-4" />
                        {daysLeft} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pickup Instructions Card */}
            <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Pickup Details</h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-200/60">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-slate-900">Pickup Instructions</h4>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {activeFoods?.foodPost?.pickupInstructions || "Contact donor after approval for pickup details."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-rose-600" />
                      {activeFoods?.foodPost?.city}, {activeFoods?.foodPost?.district}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <p className="text-xs text-slate-500 mb-1">Requested At</p>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      {formatDate(activeFoods?.requestedAt || activeFoods?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Map and Actions */}
          <div className="space-y-8">
            {/* Live Map Card */}
            <Card className="p-6 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Live Pickup Map</h2>
              </div>

              {donorPosition ? (
                <div className="space-y-4">
                  <div className="h-[350px] rounded-xl overflow-hidden border-2 border-slate-200/60">
                    <MapContainer
                      center={mapCenter}
                      zoom={14}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Donor Marker */}
                      <Marker position={donorPosition} icon={donorIcon}>
                        <Popup className="custom-popup">
                          <div className="p-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                              <strong className="text-emerald-700">Pickup Location</strong>
                            </div>
                            <p className="text-sm text-slate-600">{activeFoods?.foodPost?.city}</p>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Receiver Live Marker */}
                      {receiverPosition && (
                        <Marker position={receiverPosition} icon={receiverIcon}>
                          <Popup className="custom-popup">
                            <div className="p-2">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <strong className="text-blue-700">Recipient (Live)</strong>
                              </div>
                              <p className="text-sm text-slate-600">Currently en route</p>
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Live Route */}
                      {receiverPosition && donorPosition && (
                        <LiveRoute from={receiverPosition} to={donorPosition} />
                      )}
                    </MapContainer>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-600">Pickup Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-slate-600">Recipient Location</span>
                    </div>
                  </div>

                  {/* Google Maps Navigation */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${donorPosition[0]},${donorPosition[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Google Maps
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 rounded-2xl bg-slate-100/80 inline-flex mb-4">
                    <MapPin className="h-12 w-12 text-slate-400" />
                  </div>
                  <p className="text-slate-600">Pickup location not available</p>
                </div>
              )}
            </Card>

            {/* Actions Card */}
            <Card className="p-6 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Pickup Actions</h2>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleCompletePickup}
                  disabled={loading || completeLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
                >
                  {loading || completeLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Picked Up
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = `tel:${activeFoods?.receiver?.phone}`}
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Recipient
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${activeFoods?.receiver?.email}`}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>

                {completeError && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/60">
                    <div className="flex items-center gap-2 text-rose-700 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {completeError}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <h4 className="font-semibold text-slate-900 mb-4">Pickup Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Recipient ETA</span>
                    <span className="font-medium text-slate-900">Live Tracking</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Food Status</span>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                      Ready for Pickup
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Request Status</span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Accepted
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 rounded-2xl border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/30">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-slate-900">Pickup Tips</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Ensure food is properly packaged and ready for pickup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Confirm recipient identity before handing over food</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Mark as picked up only after successful handover</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}