// components/popups/RatingPopup.jsx
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "../../../../components/ui/dialog";
import { Star, CheckCircle, AlertCircle, X, Sparkles, Heart } from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";

export const RatingPopup = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  error,
  post 
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      return;
    }
    onSubmit({
      receiverId: post?.receiver?._id,
      rating: rating,
      comment: review,
    });
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    setHoverRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Rate Recipient
            </DialogTitle>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <p className="text-slate-600">Share your experience with this recipient</p>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-8">
            {/* Food Item Preview */}
            {post && (
              <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={post?.foodPost?.photo ? IMAGE_URL + post?.foodPost?.photo : "https://via.placeholder.com/150"}
                      alt={post?.foodPost?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{post?.foodPost?.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{post?.foodPost?.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-sm text-slate-500">Recipient:</div>
                      <div className="font-medium text-slate-900">
                        {post?.receiver?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rating Stars */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900">How was your experience?</h3>
              </div>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`h-12 w-12 transition-all duration-200 ${
                        value <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400 drop-shadow-lg"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="mb-2">
                <p className="text-xl font-bold text-slate-900">
                  {rating > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full">
                        {rating} out of 5
                      </span>
                    </span>
                  ) : (
                    "Select stars above"
                  )}
                </p>
              </div>
            </div>

            {/* Review Textarea */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-900">
                Your Review (Optional)
                <span className="text-slate-400 ml-1">— Help others with your feedback</span>
              </label>
              
              <Textarea
                placeholder="Share details about your experience... What went well? Any suggestions?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="rounded-xl border-slate-300/80 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none"
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

            {/* Feedback Alerts */}
            {rating >= 4 && rating <= 5 && (
              <Alert className="border-emerald-200 bg-linear-to-r from-emerald-50 to-emerald-100/50">
                <Heart className="h-5 w-5 text-emerald-600" />
                <AlertDescription className="text-emerald-800">
                  Thank you for your positive feedback! It helps build trust in our community.
                </AlertDescription>
              </Alert>
            )}

            {rating > 0 && rating <= 3 && (
              <Alert className="border-amber-200 bg-linear-to-r from-amber-50 to-amber-100/50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  We appreciate your honest feedback. It helps us improve the experience for everyone.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-300 hover:border-slate-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Submit Rating
              </div>
            )}
          </Button>
        </DialogFooter>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50/80 border border-rose-200/60">
            <div className="flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200/60 text-center">
          <p className="text-xs text-slate-500">
            Your feedback helps improve the Annapurna Bhandar community for everyone
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};