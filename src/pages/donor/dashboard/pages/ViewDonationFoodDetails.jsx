import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { useEffect, useState } from "react";
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
  Calendar,
  Share2,
  Edit,
  Users,
  Navigation,
  Phone,
  Mail,
  Shield,
  Award,
  Heart,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  Info,
  Thermometer,
  Scale,
  Home,
  Truck
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetFoodDetails } from "../../../recipient/browser/hooks/useGetFoodDetails";

export default function DonorFoodDetail() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  const { foods: post, loading, FoodDonationDetails } = useGetFoodDetails();

  useEffect(() => {
    FoodDonationDetails(foodId);
  }, [foodId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'accepted': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'completed': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'expired': return 'bg-gradient-to-r from-rose-500 to-rose-600';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <Package className="h-4 w-4" />;
      case 'accepted': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading donation details...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching food donation information</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-12 text-center rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <AlertCircle className="mx-auto h-16 w-16 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Donation Not Found</h2>
          <p className="text-slate-600 mb-8">The requested donation could not be found or has been removed.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(post.expiryDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-slate-300 hover:border-slate-400"
                onClick={() => FoodDonationDetails(foodId)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Food Image with Status */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl group">
              <img
                src={post.photo ? IMAGE_URL + post.photo : "https://via.placeholder.com/1200x600"}
                alt={post.title}
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-6 left-6">
                <Badge className={`${getStatusColor(post.status)} text-white shadow-xl`}>
                  {getStatusIcon(post.status)}
                  <span className="ml-2 font-semibold">
                    {post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}
                  </span>
                </Badge>
              </div>
              <div className="absolute top-6 right-6">
                <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/60 shadow-xl">
                  <Scale className="h-4 w-4 mr-2" />
                  {post.quantity} {post.unit}
                </Badge>
              </div>
              <div className="absolute bottom-6 left-6">
                <Badge className={`${
                  daysLeft <= 2 ? 'bg-gradient-to-r from-rose-500 to-rose-600' :
                  daysLeft <= 7 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                  'bg-gradient-to-r from-emerald-500 to-emerald-600'
                } text-white shadow-xl`}>
                  <Thermometer className="h-4 w-4 mr-2" />
                  {daysLeft} days left
                </Badge>
              </div>
            </div>

            {/* Food Details Card */}
            <Card className="p-8 rounded-3xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">{post.title}</h1>
                  <p className="text-lg text-slate-600 leading-relaxed">{post.description}</p>
                </div>
                {post.rating && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/50 p-3 rounded-xl border border-amber-200/60">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i <= (post.rating?.value || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg text-slate-900 ml-2">
                      {post.rating?.value?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
                  <p className="text-sm text-slate-500 mb-2">Quantity</p>
                  <p className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-emerald-600" />
                    {post.quantity} {post.unit}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
                  <p className="text-sm text-slate-500 mb-2">Expiry Date</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    {formatDate(post.expiryDate)}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
                  <p className="text-sm text-slate-500 mb-2">Posted On</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
                  <p className="text-sm text-slate-500 mb-2">Location</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-rose-600" />
                    {post.city}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Pickup Instructions */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Pickup Instructions</h3>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {post.pickupInstructions || "Contact donor after approval for pickup details."}
                  </p>
                </div>

                {/* Location Details */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Pickup Location</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-slate-900">
                      {post.city}, {post.district}
                    </p>
                    {post.lat && post.lng && (
                      <div className="space-y-2">
                        <a
                          href={`https://www.google.com/maps?q=${post.lat},${post.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Navigation className="h-4 w-4" />
                          Open in Google Maps
                        </a>
                        <button
                          onClick={() => setShowMap(!showMap)}
                          className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <ChevronRight className={`h-3 w-3 transition-transform ${showMap ? 'rotate-90' : ''}`} />
                          {showMap ? 'Hide Map' : 'Show Map Preview'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              {showMap && post.lat && post.lng && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200/60">
                  <iframe
                    title="location-map"
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${post.lat},${post.lng}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Donor Information Card */}
            <Card className="p-8 rounded-3xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-xl sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Donor Information</h3>
              </div>

              {/* Donor Profile */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60 mb-6">
                <div className="relative">
                  {post?.donor?.profilePicture ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-200">
                      <img
                        src={IMAGE_URL + post.donor.profilePicture}
                        alt={post.donor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-emerald-600" />
                    </div>
                  )}
                  {post?.donor?.accountVerified === "verified" && (
                    <div className="absolute -top-1 -right-1">
                      <Shield className="h-5 w-5 text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900">{post?.donor?.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Member since {new Date(post?.donor?.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  {post?.donor?.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i <= (post.donor.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-medium text-slate-700 ml-1">
                        {post.donor.rating?.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={() => navigate(`/donor/food/${post._id}/requests`)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Requests
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/update-food/${post._id}`)}
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Donation
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    className="border-slate-300 hover:border-slate-400"
                    onClick={() => navigate('/donation-history')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    History
                  </Button>
                  <Button
                    variant="ghost"
                    className="border-slate-300 hover:border-slate-400"
                    onClick={() => navigate('/donor-dashboard')}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              {(post?.donor?.phone || post?.donor?.email) && (
                <div className="mt-8 pt-6 border-t border-slate-200/60">
                  <h4 className="font-semibold text-slate-900 mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    {post?.donor?.phone && (
                      <a
                        href={`tel:${post.donor.phone}`}
                        className="flex items-center gap-3 text-slate-700 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">{post.donor.phone}</span>
                      </a>
                    )}
                    {post?.donor?.email && (
                      <a
                        href={`mailto:${post.donor.email}`}
                        className="flex items-center gap-3 text-slate-700 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">{post.donor.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-6 rounded-2xl border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/30">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-slate-900">Important Notes</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Respond to requests within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Update status promptly after pickup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Provide clear pickup instructions</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 pt-8 border-t border-slate-200/60">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-5 rounded-2xl border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-100/30">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Food Safety</h4>
              </div>
              <p className="text-sm text-slate-600">
                Ensure food is stored properly and within safe temperature ranges before pickup.
              </p>
            </Card>
            
            <Card className="p-5 rounded-2xl border-blue-200/60 bg-gradient-to-r from-blue-50 to-blue-100/30">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Communication</h4>
              </div>
              <p className="text-sm text-slate-600">
                Maintain clear communication with recipients regarding pickup times and locations.
              </p>
            </Card>
            
            <Card className="p-5 rounded-2xl border-purple-200/60 bg-gradient-to-r from-purple-50 to-purple-100/30">
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-slate-900">Community Impact</h4>
              </div>
              <p className="text-sm text-slate-600">
                Your donation helps reduce food waste and supports community members in need.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}