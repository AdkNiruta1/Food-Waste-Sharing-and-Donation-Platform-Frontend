import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  User,
  Phone,
  Star,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";
import { useEffect } from "react";
import { useGetActiveDonationById } from "../hooks/useGetActiveDonationById";
import { useParams } from "react-router-dom";
import { IMAGE_URL } from "../../../../constants/constants";
// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function DonorViewRequestDetails() {
  const { foods: activeFoods, loading: activeLoading, error: activeError, fetchMyActiveDonationById } = useGetActiveDonationById();
  const { id: donationId } = useParams();
  useEffect(() => {
    fetchMyActiveDonationById(donationId);
  }, []);
  // Donor location (food location)
  // const donorPosition = [activeFoods.lat, activeFoods.lng];
  

  // activeFoods location (fallback if not available)
  // const activeFoodsPosition = donorPosition; 

  return (
    activeLoading ? (
      <p className="text-center mt-20">Loading...</p>
    ) : activeError ? (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <h2 className="text-xl font-bold mb-4">Error Loading Request</h2>
          <p className="text-red-600 mb-4">{activeError}</p>
        </Card>
      </div>
    ) : (

    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Request Details
        </h1>

        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
          Accepted – Waiting for Pickup
        </span>
      </div>


      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Receiver Information
            </h2>

            <div className="flex items-center gap-4">
              <img
                src={IMAGE_URL + activeFoods?.receiver?.profilePicture}
                alt={activeFoods?.receiver?.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold text-slate-900">
                  {activeFoods?.receiver?.name}
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {activeFoods?.receiver?.phone}
                </p>

                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {activeFoods?.receiver?.rating} ({activeFoods?.receiver?.ratingCount} ratings)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Food Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <img
                src={`${IMAGE_URL}${activeFoods?.foodPost?.photo}`}
                alt={activeFoods?.foodPost?.title}
                className="rounded-lg h-48 w-full object-cover"
              />

              <div>
                <h3 className="font-bold text-xl">{activeFoods?.foodPost?.title}</h3>
                <p className="text-slate-600 mt-2">
                  {activeFoods?.foodPost?.description}
                </p>

                <p className="mt-2 text-sm">
                  <strong>Quantity:</strong>{" "}
                  {activeFoods?.foodPost?.quantity} {activeFoods?.foodPost?.unit}
                </p>

                <p className="text-sm flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  Expires on{" "}
                  {new Date(activeFoods?.foodPost?.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Pickup Instructions
            </h2>

            <p className="text-slate-700">
              {activeFoods?.foodPost?.pickupInstructions}
            </p>

            <p className="text-sm text-slate-600 mt-2">
              📍 {activeFoods?.foodPost?.city}, {activeFoods?.foodPost?.district}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="font-semibold text-lg mb-4">
              Live Pickup Map
            </h2>

            {/* <MapContainer
              center={donorPosition}
              zoom={14}
              className="h-[350px] w-full rounded-lg"
            >
              <TileLayer
                attribution="© OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={donorPosition}>
                <Popup>Pickup Location</Popup>
              </Marker>

              <Marker position={activeFoodsPosition}>
                <Popup>activeFoods Location</Popup>
              </Marker>

              <Polyline
                positions={[activeFoodsPosition, donorPosition]}
                color="blue"
              />
            </MapContainer> */}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeFoods?.lat},${activeFoods?.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Navigate with Google Maps
              </Button>
            </a>
          </Card>
        </div>
      </div>
     
    </div>
    )
  );
}
