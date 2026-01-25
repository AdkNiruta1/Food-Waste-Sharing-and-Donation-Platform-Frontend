import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Phone,
  Mail,
  User,
  Shield,
  Award,
  Package,
  MapPin,
  Calendar,
  Users,
  Heart,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  Home,
  CheckCircle,
  RefreshCw,
  X
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetUserById } from "../../../admin/users/hooks/useGetUserById";
import { useEffect } from "react";

export default function ReceiverViewDonorDetails({
  isOpen,
  onClose,
  donorId: propDonorId
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Use propDonorId if provided, otherwise use route param id
  const donorId = propDonorId || id;
  
  const {
    user: donor,
    loading: donorLoading,
    error: donorError,
    fetchUserById
  } = useGetUserById();

  useEffect(() => {
    if (donorId) {
      fetchUserById(donorId);
    }
  }, [donorId]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  // For modal/popup view
  const isModal = isOpen !== undefined;

  if (isModal && !isOpen) {
    return null;
  }

  if (donorLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading donor details...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching donor information</p>
      </div>
    );
  }

  if (donorError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <div className="p-4 rounded-2xl bg-rose-50/80 inline-flex mb-4">
            <Shield className="h-12 w-12 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Donor</h2>
          <p className="text-slate-600 mb-6">{donorError}</p>
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg max-w-md">
          <div className="p-4 rounded-2xl bg-slate-100/80 inline-flex mb-4">
            <User className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Donor Not Found</h2>
          <p className="text-slate-600 mb-6">The requested donor could not be found</p>
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const renderContent = () => (
    <Card className={`p-8 rounded-3xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-xl ${
      isModal ? 'relative' : ''
    }`}>
      {/* Close button for modal */}
      {isModal && (
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>
      )}

      {/* Donor Profile Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
            {donor?.profilePicture ? (
              <img
                src={`${IMAGE_URL}${donor?.profilePicture}`}
                alt={donor?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <User className="h-16 w-16 text-emerald-600" />
              </div>
            )}
          </div>
          {donor?.accountVerified === "verified" && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">{donor?.name}</h1>
        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm px-4 py-1">
          <Users className="h-3 w-3 mr-1" />
          Food Donor
        </Badge>

        {/* Donor Rating */}
        {donor?.rating && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {renderStars(donor?.rating)}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {donor?.rating?.toFixed(1) || "0.0"}
              </p>
              <p className="text-xs text-slate-500">
                ({donor?.ratingCount || 0} reviews)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Donor Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200/60">
          <div className="p-2 rounded-full bg-emerald-100 inline-flex mb-2">
            <Package className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{donor?.totalDonations || 0}</p>
          <p className="text-xs text-slate-600">Donations</p>
        </div>

        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200/60">
          <div className="p-2 rounded-full bg-blue-100 inline-flex mb-2">
            <Award className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{donor?.rating?.toFixed(1) || "0.0"}</p>
          <p className="text-xs text-slate-600">Rating</p>
        </div>

        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/30 border border-amber-200/60">
          <div className="p-2 rounded-full bg-amber-100 inline-flex mb-2">
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{donor?.ratingCount || 0}</p>
          <p className="text-xs text-slate-600">Reviews</p>
        </div>

        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-200/60">
          <div className="p-2 rounded-full bg-purple-100 inline-flex mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">Since {formatDate(donor?.createdAt)}</p>
          <p className="text-xs text-slate-600">Member</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          Contact Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="font-bold text-slate-900 truncate">{donor?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone Number</p>
                <p className="font-bold text-slate-900">{donor?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {donor?.address && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Address</p>
                <p className="font-bold text-slate-900">{donor?.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donor Bio */}
      {donor?.bio && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            About the Donor
          </h3>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-200/60">
            <p className="text-slate-700 leading-relaxed">"{donor?.bio}"</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <a href={`tel:${donor?.phone}`} className="block">
          <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 text-white py-6">
            <Phone className="mr-2 h-5 w-5" />
            Call Donor
          </Button>
        </a>

        <a href={`mailto:${donor?.email}`} className="block">
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 py-6"
          >
            <Mail className="mr-2 h-5 w-5" />
            Send Email
          </Button>
        </a>

        <Button
          variant="outline"
          onClick={handleClose}
          className="w-full border-slate-300 hover:border-slate-400 py-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Request History
        </Button>

        {!isModal && (
          <Button
            variant="ghost"
            onClick={() => navigate('/request-history')}
            className="w-full text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
          >
            <Home className="mr-2 h-5 w-5" />
            View All Requests
          </Button>
        )}
      </div>

      {/* Verification Status */}
      {donor?.accountVerified === "verified" && (
        <div className="mt-10 pt-8 border-t border-slate-200/60">
          <div className="flex items-center justify-center gap-3 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            <p className="font-medium">This donor is verified and trusted by our community</p>
          </div>
        </div>
      )}
    </Card>
  );

  // Render modal or full page based on props
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="min-h-screen max-h-[90vh] overflow-y-auto w-full max-w-4xl">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to History</span>
            </button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => fetchUserById(donorId)}
                className="border-slate-300 hover:border-slate-400"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-10">
        {renderContent()}
      </div>
    </div>
  );
}