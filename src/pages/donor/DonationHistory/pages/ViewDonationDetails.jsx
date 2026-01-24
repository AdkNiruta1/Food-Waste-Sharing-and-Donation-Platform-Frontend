import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "../../../../components/ui/dialog";
import {
  Package,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
  Heart,
  X,
  AlertCircle,
  Info,
  Navigation,
  Phone,
  Mail,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  ChevronRight,
  CalendarDays,
  Scale,
  Thermometer,
  Navigation2
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";

export const ViewDetailsPopup = ({
  isOpen,
  onClose,
  donation,
  loading = false,
  error = null
}) => {

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-linear-to-br from-emerald-500 to-emerald-600';
      case 'accepted': return 'bg-linear-to-br from-blue-500 to-blue-600';
      case 'expired': return 'bg-linear-to-br from-rose-500 to-rose-600';
      case 'available': return 'bg-linear-to-br from-amber-500 to-amber-600';
      default: return 'bg-linear-to-br from-slate-500 to-slate-600';
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

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'cooked': return 'bg-linear-to-br from-amber-500 to-amber-600';
      case 'packaged': return 'bg-linear-to-br from-blue-500 to-blue-600';
      case 'raw': return 'bg-linear-to-br from-emerald-500 to-emerald-600';
      case 'other': return 'bg-linear-to-br from-purple-500 to-purple-600';
      default: return 'bg-linear-to-br from-slate-500 to-slate-600';
    }
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

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const getGoogleMapsUrl = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading donation details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-linear-to-br from-emerald-100 to-emerald-200">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Donation Details
                </DialogTitle>
                <p className="text-slate-600">Complete information about this donation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </DialogHeader>

        <DialogBody>
          {error ? (
            <div className="p-6 text-center">
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/60 inline-flex mb-4">
                <AlertCircle className="h-12 w-12 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Details</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          ) : donation ? (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Food Image */}
                <div className="relative shrink-0">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                    <img
                      src={donation.photo ? IMAGE_URL + donation.photo : "https://via.placeholder.com/300"}
                      alt={donation.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge className={`${getStatusColor(donation.status)} text-white shadow-lg`}>
                      {getStatusIcon(donation.status)}
                      <span className="ml-1">{donation.status?.charAt(0).toUpperCase() + donation.status?.slice(1)}</span>
                    </Badge>
                  </div>
                </div>

                {/* Title and Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{donation.title}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`${getTypeColor(donation.type)} text-white`}>
                          {donation.type || "Other"}
                        </Badge>
                        <Badge variant="outline" className="border-slate-300">
                          <Scale className="h-3 w-3 mr-1" />
                          {donation.quantity} {donation.unit}
                        </Badge>
                      </div>
                    </div>
                    
                    {donation.rating && (
                      <div className="flex items-center gap-2 bg-linear-to-br from-amber-50 to-amber-100/50 p-3 rounded-xl border border-amber-200/60">
                        <div className="flex items-center gap-1">
                          {renderStars(donation.rating.value)}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-slate-900">{donation.rating.value?.toFixed(1) || "0.0"}</p>
                          <p className="text-xs text-slate-500">Your rating</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-700 text-lg leading-relaxed">{donation.description}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Posted</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(donation.createdAt)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Expires</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(donation.expiryDate)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                      <p className="text-xs text-slate-500 mb-1">Days Left</p>
                      <p className={`font-bold flex items-center gap-1 ${
                        calculateDaysLeft(donation.expiryDate) <= 2 ? 'text-rose-600' :
                        calculateDaysLeft(donation.expiryDate) <= 7 ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        <Thermometer className="h-4 w-4" />
                        {calculateDaysLeft(donation.expiryDate)} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location and Pickup Instructions */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-5 rounded-2xl border-slate-200/80 bg-linear-to-br from-slate-50 to-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-500" />
                    Pickup Location
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-linear-to-br from-blue-50 to-blue-100/50 border border-blue-200/60">
                      <p className="font-medium text-slate-900 mb-1">{donation.city}</p>
                      <p className="text-sm text-slate-600">{donation.district}, Nepal</p>
                      {donation.lat && donation.lng && (
                        <div className="mt-3">
                          <a
                            href={getGoogleMapsUrl(donation.lat, donation.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Navigation2 className="h-4 w-4" />
                            Open in Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                    { donation.lat && donation.lng && (
                      <div className="rounded-xl overflow-hidden border border-slate-200/60">
                        <iframe
                          title="location-map"
                          width="100%"
                          height="200"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://maps.google.com/maps?q=${donation.lat},${donation.lng}&z=15&output=embed`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-5 rounded-2xl border-slate-200/80 bg-linear-to-br from-slate-50 to-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-slate-500" />
                    Pickup Instructions
                  </h3>
                  <div className="p-4 rounded-xl bg-linear-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60">
                    <p className="text-slate-700 whitespace-pre-wrap">{donation.pickupInstructions || "No specific instructions provided."}</p>
                  </div>
                </Card>
              </div>

              {/* Recipient Information (if accepted/completed) */}
              {donation.acceptedRequest?.receiver && (
                <Card className="p-5 rounded-2xl border-slate-200/80 bg-linear-to-br from-slate-50 to-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-slate-500" />
                    Recipient Information
                  </h3>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-br from-slate-50/80 to-white border border-slate-200/60">
                    <div className="relative">
                      {donation.acceptedRequest.receiver.profilePicture ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-200">
                          <img
                            src={IMAGE_URL + donation.acceptedRequest.receiver.profilePicture}
                            alt={donation.acceptedRequest.receiver.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                          <Users className="h-8 w-8 text-emerald-600" />
                        </div>
                      )}
                      {donation.acceptedRequest.receiver.accountVerified === "verified" && (
                        <div className="absolute -top-1 -right-1">
                          <Shield className="h-5 w-5 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Recipient</p>
                          <h4 className="font-bold text-lg text-slate-900">{donation.acceptedRequest.receiver.name}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            {donation.acceptedRequest.receiver.rating && (
                              <div className="flex items-center gap-1">
                                {renderStars(donation.acceptedRequest.receiver.rating)}
                                <span className="text-sm font-medium text-slate-700 ml-1">
                                  {donation.acceptedRequest.receiver.rating?.toFixed(1)}
                                </span>
                              </div>
                            )}
                            {donation.acceptedRequest.receiver.phone && (
                              <a
                                href={`tel:${donation.acceptedRequest.receiver.phone}`}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Phone className="h-3 w-3" />
                                Call
                              </a>
                            )}
                          </div>
                        </div>
                        {donation.acceptedRequest.status === "completed" && donation.acceptedRequest.completedAt && (
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Completed on</p>
                            <p className="font-medium text-slate-900">
                              {new Date(donation.acceptedRequest.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      {donation.acceptedRequest.receiver.address && (
                        <p className="text-sm text-slate-600 mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {donation.acceptedRequest.receiver.address}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Timeline Information */}
              <Card className="p-5 rounded-2xl border-slate-200/80 bg-linear-to-br from-slate-50 to-white">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-500" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Posted</p>
                      <p className="font-medium text-slate-900">
                        {formatDate(donation.createdAt)} at {new Date(donation.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {donation.acceptedRequest?.acceptedAt && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Accepted by Recipient</p>
                        <p className="font-medium text-slate-900">
                          {formatDate(donation.acceptedRequest.acceptedAt)} at {new Date(donation.acceptedRequest.acceptedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {donation.acceptedRequest?.completedAt && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Completed</p>
                        <p className="font-medium text-slate-900">
                          {formatDate(donation.acceptedRequest.completedAt)} at {new Date(donation.acceptedRequest.completedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-6 rounded-2xl bg-slate-100 inline-flex mb-6">
                <Package className="h-20 w-20 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Donation Not Found</h3>
              <p className="text-slate-600">The donation details could not be loaded</p>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          {donation && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-slate-300 hover:border-slate-400"
              >
                Close
              </Button>
              {donation.lat && donation.lng && (
                <a
                  href={getGoogleMapsUrl(donation.lat, donation.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Navigation className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </a>
              )}
              {donation.acceptedRequest?.receiver?.phone && (
                <a href={`tel:${donation.acceptedRequest.receiver.phone}`}>
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Recipient
                  </Button>
                </a>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};