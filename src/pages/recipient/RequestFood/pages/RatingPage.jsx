import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Textarea } from "../../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import {
  Star,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Heart,
  User,
  Shield,
  X,
  MapPin,
  Scale
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useCreateRating } from "../hooks/useCreateRating";

export default function RatingPage({
  isOpen,
  onClose,
  fetchFoodRequestList,
  donation
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { createRating, loading, error } = useCreateRating();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    createRating({
      receiverId: donation?.donor?._id,
      rating: rating,
      comment: review,
    });

    // Show success and close
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    fetchFoodRequestList();

      if (onClose) onClose();
    }, 2000);

  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // If used as a modal and not open, don't render
  if (isOpen !== undefined && !isOpen) {
    return null;
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center rounded-2xl border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/50 shadow-xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent mb-4">
            Thank You!
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Your rating has been submitted successfully.
          </p>
          <div className="animate-pulse">
            <p className="text-sm text-slate-500">Closing...</p>
          </div>
        </Card>
      </div>
    );
  }

  const renderContent = () => (
    <Card className={`p-8 rounded-3xl border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-xl ${isOpen ? 'relative' : ''
      }`}>
      {/* Close button for modal */}
      {isOpen && (
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>
      )}

      {/* Header for non-modal view */}
      {!isOpen && (
        <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/30 border-b border-emerald-200/60 mb-8 -mx-8 -mt-8 px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to History</span>
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h1 className="text-2xl font-bold text-slate-900">Rate Donation</h1>
            </div>
          </div>
        </div>
      )}

      {/* Food Info Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
          <img
            src={donation?.photo ? IMAGE_URL + donation.photo : "https://via.placeholder.com/150"}
            alt={donation?.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{donation?.title}</h2>
          <p className="text-slate-600 mb-4">{donation?.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-200">
                {donation?.donor?.profilePicture ? (
                  <img
                    src={IMAGE_URL + donation.donor.profilePicture}
                    alt={donation.donor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                )}
              </div>
              <span className="font-medium text-slate-900">{donation?.donor?.name}</span>
              {donation?.donor?.accountVerified === "verified" && (
                <Shield className="h-4 w-4 text-emerald-500" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Scale className="h-4 w-4 text-slate-500" />
                <span>{donation?.quantity} {donation?.unit}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{donation?.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Rating Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600">
              <Star className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">How was your experience?</h3>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-all duration-300 hover:scale-125 active:scale-95"
              >
                <Star
                  className={`h-16 w-16 transition-all duration-300 ${value <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400 drop-shadow-xl"
                    : "text-slate-300"
                    }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            {rating > 0 ? (
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60">
                <span className="text-2xl font-bold text-amber-700">{rating}</span>
                <span className="text-lg text-slate-700">out of 5 stars</span>
              </div>
            ) : (
              <p className="text-lg text-slate-600">Select stars above to rate</p>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Your Review (Optional)</h4>
              <p className="text-slate-600 text-sm">Share details about your experience to help others</p>
            </div>
          </div>

          <Textarea
            placeholder="Tell us about your experience with this food donation. Was the food fresh? How was the donor?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            className="rounded-xl border-slate-300/80 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none text-slate-900"
            maxLength={500}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              {review.length}/500 characters
            </p>
            {review.length >= 10 && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle className="h-3 w-3" />
                Great feedback!
              </div>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        {rating >= 4 && rating <= 5 && (
          <Alert className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50">
            <Heart className="h-5 w-5 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              Thank you for your positive feedback! It helps build trust in our community.
            </AlertDescription>
          </Alert>
        )}

        {rating > 0 && rating <= 3 && (
          <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              We appreciate your honest feedback. It helps us improve the experience for everyone.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-200/60">
          <Button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 text-white py-6 text-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Submitting Rating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Submit Rating
              </div>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200/60">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-slate-200/60 text-center">
        <p className="text-sm text-slate-500">
          Your honest feedback helps make Annapurna Bhandar better for everyone
        </p>
      </div>
    </Card>
  );

  // Render modal or full page based on props
  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-10">
        {renderContent()}
      </div>
    </div>
  );
}