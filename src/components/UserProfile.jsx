import { useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Edit2, Mail, Phone, MapPin, Star, Shield, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../hooks/useMe"; // your auth hook
import defaultProfileImage from "/image.png";
export default function UserProfile() {
  const { user: currentUser, loading } = useAuth();
  const [reviewFilter, setReviewFilter] = useState("all"); // review filter

  // Display a loader while fetching user
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-slate-600">Loading profile...</p>
      </div>
    );
  }

  // If no user is returned, show message
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">User not found or not authenticated.</p>
      </div>
    );
  }

  const user = currentUser;
  const isCurrentUser = true; // since we only show the logged-in user

  // Dummy reviews for now, you can later fetch from backend
  const mockReviews = [
    { rating: 5, text: "Very reliable donor! Food was fresh and pickup was smooth. Highly recommend.", date: "1 week ago" },
    { rating: 4, text: "Punctual and respectful recipient. Great communication throughout.", date: "2 weeks ago" },
    { rating: 5, text: "Excellent experience. Generous portion and well-organized.", date: "1 month ago" },
    { rating: 3, text: "Good overall, but pickup time was slightly delayed.", date: "2 months ago" },
  ];

  const filteredReviews = mockReviews.filter((review) => {
    if (reviewFilter === "all") return true;
    if (reviewFilter === "5") return review.rating === 5;
    if (reviewFilter === "4") return review.rating === 4;
    if (reviewFilter === "3below") return review.rating <= 3;
    return true;
  });

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-300"
        }`}
      />
    ));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-green-500/10 to-green-500/5 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.profileImage ? user.profileImage : defaultProfileImage}
                alt={user.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
              />
              {user.accountVerified === "verified" && (
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                {user.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(user.rating)}
                  <span className="font-semibold text-slate-900 ml-2">{user.rating}</span>
                  <span className="text-sm text-slate-600">({user.totalRatings} reviews)</span>
                </div>

                <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  {user.role === "admin" ? "Admin" : user.role === "donor" ? "Food Donor" : "Food Recipient"}
                </span>
              </div>

              <p className="text-lg text-slate-600 max-w-2xl">{user.bio}</p>
            </div>

            {/* Edit Button */}
            {isCurrentUser && (
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Edit2 className="mr-2 h-5 w-5" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-5">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">{user.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Verification */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-5">Document Verification</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Citizenship</span>
                  {user.documents?.citizenship ? (
                    <Shield className="h-6 w-6 text-green-600" />
                  ) : (
                    <span className="text-sm text-slate-500">Not submitted</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">PAN Card</span>
                  {user.documents?.pan ? (
                    <Shield className="h-6 w-6 text-green-600" />
                  ) : (
                    <span className="text-sm text-slate-500">Not submitted</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Driving License</span>
                  {user.documents?.drivingLicense ? (
                    <Shield className="h-6 w-6 text-green-600" />
                  ) : (
                    <span className="text-sm text-slate-500">Not submitted</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-5">Activity Stats</h3>
              <div className="space-y-5">
                {user.role === "donor" ? (
                  <>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Donations</p>
                      <p className="text-3xl font-bold text-green-600">{user.stats?.donations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Successfully Completed</p>
                      <p className="text-2xl font-bold text-green-600">{user.stats?.completed}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Requests</p>
                      <p className="text-3xl font-bold text-green-600">{user.stats?.requests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Successfully Received</p>
                      <p className="text-2xl font-bold text-green-600">{user.stats?.completed}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Tabs Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card className="p-8 border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">About Me</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{user.bio}</p>

                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">Member since</p>
                    <p className="text-lg font-medium text-slate-900">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="p-8 border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Community Reviews</h3>

                  {/* Review Filter */}
                  <div className="mb-8">
                    <p className="text-sm font-medium text-slate-700 mb-4">Filter by rating:</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "all", label: "All Reviews" },
                        { value: "5", label: "5 Stars" },
                        { value: "4", label: "4 Stars" },
                        { value: "3below", label: "3 Stars & Below" },
                      ].map(({ value, label }) => (
                        <label
                          key={value}
                          className={`flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer transition-all ${
                            reviewFilter === value
                              ? "bg-green-600 text-white border-green-600 shadow-sm"
                              : "bg-white border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="reviewFilter"
                            value={value}
                            checked={reviewFilter === value}
                            onChange={(e) => setReviewFilter(e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filteredReviews.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">
                        No reviews match the selected filter.
                      </p>
                    ) : (
                      filteredReviews.map((review, i) => (
                        <div key={i} className="pb-6 border-b border-slate-200 last:border-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium text-slate-900">Anonymous User</p>
                              <p className="text-sm text-slate-500 mt-1">{review.date}</p>
                            </div>
                            <div className="flex gap-1">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-slate-600">{review.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="p-8 border-slate-200 text-center">
                  <Award className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Activity History</h3>
                  <p className="text-slate-600 mb-8">
                    View all past {user.role === "donor" ? "donations" : "requests"} and completed transactions.
                  </p>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    View Full History
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
