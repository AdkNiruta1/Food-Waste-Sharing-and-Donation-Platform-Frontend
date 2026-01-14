import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Textarea } from "../../../../components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { Star, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { useGetFoodRequestDetails } from "../../dashboard/hooks/useGetFoodRequestDetails";
import { IMAGE_URL } from "../../../../constants/constants";
import { useCreateRating } from "../hooks/useCreateRating";

export default function RatingPage() {
  const navigate = useNavigate();
  const { foodId } = useParams();
  const { foods: post, loading, FoodRequestDetails } = useGetFoodRequestDetails();
  const { createRating,
    loading: loadingRating,
    error } = useCreateRating();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    FoodRequestDetails(foodId);
  }, [foodId]);

  const ratingData = {
    name: post?.foodPost?.title || "Food Item",
    description: post?.foodPost?.description || "No description available.",
    image:
      post?.foodPost?.photo
        ? IMAGE_URL +  post?.foodPost?.photo
        : "https://via.placeholder.com/150",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    createRating({
      "receiverId": post?.foodPost?.donor?._id,
      "rating": rating,
      "comment": review,
    });
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <Card className="max-w-md w-full p-10 text-center border-slate-200 shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
            <p className="text-lg text-slate-600 mb-6">
              Your rating has been submitted successfully.
            </p>
            <p className="text-sm text-slate-500">Redirecting back...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-lg w-full p-10 border-slate-200 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Rate Your Experience
          </h1>

          {/* Item Info */}
          <div className="mb-10 text-center">
            <img
              src={ratingData.image}
              alt={ratingData.name}
              className="w-40 h-40 rounded-2xl object-cover mx-auto mb-6 shadow-md"
            />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {ratingData.name}
            </h2>
            <p className="text-slate-600">{ratingData.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Rating Stars */}
            <div className="space-y-4">
              <div className="text-lg font-medium text-slate-900 block text-center">
                How would you rate this?
              </div>

              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`h-14 w-14 transition-colors ${
                        value <= (hoverRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-xl font-semibold text-slate-900">
                  {rating > 0 ? `${rating} out of 5 stars` : "Select stars above"}
                </p>
              </div>
            </div>

            {/* Review Textarea */}
            <div className="space-y-3">
              <div className="text-lg font-medium text-slate-900 block">
                Your Review (Optional)
              </div>

              <Textarea
                placeholder="Share your experience... (minimum 10 characters recommended)"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                className="resize-none"
              />

              <p className="text-sm text-slate-500 text-right">
                {review.length}/500 characters
              </p>
            </div>

            {/* Feedback Alerts */}
            {rating >= 4 && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for your positive feedback! It helps build trust in our community.
                </AlertDescription>
              </Alert>
            )}

            {rating > 0 && rating < 3 && (
              <Alert variant="destructive" className="border-red-200">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                  We'd love to improve. Please tell us what went wrong so we can do better.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-7"
              disabled={loading || rating === 0}
            >
              {loadingRating ? "Submitting..." : "Submit Rating"}
            </Button>
            {error && (
              <p className="text-red-600 text-center mt-2">{error}</p>
            )}
          </form>

          <p className="text-sm text-slate-500 text-center mt-8">
            Your honest feedback helps make Annapurna Bhandar better for everyone
          </p>
        </Card>
      </div>
    </div>
  );
}