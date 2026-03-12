import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
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
  Users,
  Truck,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Thermometer,
  Scale,
  Sparkles
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const { completePickup, loading: completeLoading, error: completeError } =
    useCompletePickup();

  const [loading, setLoading] = useState(false);
  const [receiverPosition, setReceiverPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]); // Kathmandu default

  const lastGeocodedAddress = useRef(null);

  // -----------------------------
  // Geocode helper
  // -----------------------------
  const geocodeAddress = useCallback(async (address) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  }, []);
  // Fetch donation details
  useEffect(() => {
    fetchMyActiveDonationById(donationId);
  }, [donationId]);

  // Donor position
  const donorPosition =
    activeFoods?.foodPost?.lat && activeFoods?.foodPost?.lng
      ? [activeFoods.foodPost.lat, activeFoods.foodPost.lng]
      : null;
  // Geocode receiver address -> coords
  useEffect(() => {
    const address = activeFoods?.receiver?.address;

    if (!address) return;

    // Prevent re-geocoding same address
    if (lastGeocodedAddress.current === address) return;

    lastGeocodedAddress.current = address;

    (async () => {
      const coords = await geocodeAddress(address);

      if (!coords) return;

      setReceiverPosition((prev) => {
        // Prevent state update if same coords
        if (
          prev &&
          prev[0] === coords.lat &&
          prev[1] === coords.lng
        ) {
          return prev;
        }
        return [coords.lat, coords.lng];
      });
    })();
  }, [activeFoods?.receiver?.address, geocodeAddress]);

  // Update map center when donor available
  useEffect(() => {
    if (!donorPosition) return;

    setMapCenter((prev) => {
      if (
        prev[0] === donorPosition[0] &&
        prev[1] === donorPosition[1]
      ) {
        return prev;
      }
      return donorPosition;
    });
  }, [donorPosition]);

  const handleCompletePickup = async () => {
    try {
      setLoading(true);
      await completePickup({ requestId: donationId });
      setTimeout(() => navigate("/donor-dashboard"), 2000);
    } catch (err) {
      console.error("Complete pickup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i + 1 <= (rating || 0)
          ? "fill-amber-400 text-amber-400"
          : "fill-slate-200 text-slate-200"
          }`}
      />
    ));

  if (activeLoading) return <div className="p-10">Loading...</div>;
  if (activeError) return <div className="p-10 text-red-600">{activeError}</div>;

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
                      <p className={`font-bold flex items-center gap-1 ${daysLeft <= 2 ? 'text-rose-600' :
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
            <Card className="p-6 m-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Navigation /> Pickup Map
              </h2>

              {donorPosition && (
                <div className="h-[350px] rounded-xl overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={14}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Donor Marker */}
                    <Marker position={donorPosition} icon={donorIcon}>
                      <Popup>Pickup Location</Popup>
                    </Marker>

                    {/* Receiver Marker */}
                    {receiverPosition && (
                      <Marker position={receiverPosition} icon={receiverIcon}>
                        <Popup>
                          Recipient<br />
                          {activeFoods?.receiver?.address}
                        </Popup>
                      </Marker>
                    )}

                    Route Line (Pathao style)
                    {receiverPosition && donorPosition && (
                      <LiveRoute from={receiverPosition} to={donorPosition} />
                    )}
                  </MapContainer>

                </div>


              )}
              <Button
                onClick={() => {
                  const destination = `${donorPosition[0]},${donorPosition[1]}`;

                  // If receiver position exists, use it as origin
                  const origin = receiverPosition
                    ? `${receiverPosition[0]},${receiverPosition[1]}`
                    : "";

                  const url = origin
                    ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
                    : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

                  window.open(url, "_blank");
                }}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Navigate in Google Maps
              </Button>
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