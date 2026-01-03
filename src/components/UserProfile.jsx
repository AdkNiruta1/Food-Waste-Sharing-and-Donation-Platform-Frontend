import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Edit2, Mail, Phone, MapPin, Star, Shield, Award, X, } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import defaultProfileImage from "/image.png";
import { useUpdateProfile } from "../hooks/useUpdateProfile.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useUpdatePhoto } from "../hooks/useUpdatePhoto.js";
import { IMAGE_URL } from "../constants/constants.js";
import {
  LogIn,
  LogOut,
  UserPlus,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useEffect } from "react";
import { useGetMyLogs } from "../hooks/useGetActivityLog.js";
export default function UserProfile() {
  const { user: currentUser, loading, refetchUser } = useAuth();
  const [reviewFilter, setReviewFilter] = useState("all"); // review filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateProfile, loading: saving } = useUpdateProfile(); // hook for update
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const { updatePhoto, loading: uploading } = useUpdatePhoto();

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
  const getActionIcon = (action) => {
    if (action.includes("Logged In"))
      return <LogIn className="h-5 w-5 text-green-600" />;

    if (action.includes("Logged Out"))
      return <LogOut className="h-5 w-5 text-orange-600" />;

    if (action.includes("Registered"))
      return <UserPlus className="h-5 w-5 text-blue-600" />;

    return <Clock className="h-5 w-5 text-slate-500" />;
  };
  const buildMessage = (log) => {
    switch (log.action) {
      case "User Logged In":
        return "You logged into your account";
      case "User Logged Out":
        return "You logged out from your account";
      case "User Registered":
        return "Your account was successfully created";
      default:
        return log.action;
    }
  };


  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === "success")
      return `${base} bg-green-100 text-green-700`;
    if (status === "pending")
      return `${base} bg-orange-100 text-orange-700`;
    if (status === "failed")
      return `${base} bg-red-100 text-red-700`;
    return `${base} bg-slate-100 text-slate-600`;
  };

  const user = currentUser;
  const isCurrentUser = true; // since we only show the logged-in user
  // Open modal and prefill form
  const handleOpenModal = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(formData);
      await refetchUser(); // wait for user refresh
      if (updatedUser) {
        setIsModalOpen(false); // close modal only after user is updated
      }
    } catch (err) {
      console.error(err);
    }
  };


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
        className={`h-5 w-5 ${i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-300"
          }`}
      />
    ));

  function ActivityLogs() {
    const { logs, pagination, loading, fetchMyLogs } = useGetMyLogs();

    useEffect(() => {
      fetchMyLogs(1, 10);
    }, []);

    if (loading) {
      return (
        <div className="text-center py-12 text-slate-500">
          Loading activity logs...
        </div>
      );
    }

    if (!logs?.length) {
      return (
        <div className="text-center py-16">
          <Clock className="h-14 w-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            No activity recorded
          </p>
        </div>
      );
    }

    return (
      <div className="relative pl-6 space-y-8">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200" />

        {logs.map((log) => (
          <div key={log._id} className="relative flex gap-5">
            {/* Icon */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              {getActionIcon(log.action)}
            </div>

            {/* Content */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-1">
                {log.action}
              </h4>

              <p className="text-slate-600 text-sm mb-3">
                {buildMessage(log)}
              </p>

              {/* Metadata */}
              {log.metadata && (
                <div className="text-xs text-slate-500 space-y-1 mb-2">
                  {log.metadata.ip && <p>IP: {log.metadata.ip}</p>}
                  {log.metadata.userAgent && (
                    <p className="truncate">
                      Device: {log.metadata.userAgent}
                    </p>
                  )}
                  {log.metadata.role && (
                    <p>Role: {log.metadata.role}</p>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-500">
                {new Date(log.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Pagination info */}
        {pagination && (
          <p className="text-center text-xs text-slate-500 pt-6">
            Showing {logs.length} of {pagination.total} activities
          </p>
        )}
      </div>
    );
  }



  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-green-500/10 to-green-500/5 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Profile Image */}
            <div className="relative">
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full z-10">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}


              <img
                src={previewImage || user?.profilePicture ? IMAGE_URL + user?.profilePicture : defaultProfileImage}
                alt={user.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
              />

              {user.accountVerified === "verified" && (
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg z-20">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              )}

              {/* File input */}
              <label className="absolute bottom-0 left-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-20">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setPreviewImage(URL.createObjectURL(file));

                      const formData = new FormData();
                      formData.append("profilePicture", file);

                      try {
                        await updatePhoto(formData);
                        await refetchUser();
                        setPreviewImage(null);
                      } catch (err) {
                        console.error("Photo upload failed:", err);
                      }
                    }
                  }}
                />
                <Edit2 className="h-5 w-5 text-white" />
              </label>
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

              {/* <p className="text-lg text-slate-600 max-w-2xl">{user.bio}</p> */}
            </div>

            {/* Edit Button */}
            {isCurrentUser && (
              <Button onClick={handleOpenModal} size="lg" className="bg-green-600 hover:bg-green-700">
                <Edit2 className="mr-2 h-5 w-5" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-lg p-8 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </div>
      )}

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
                <TabsTrigger value="history">Activity Logs</TabsTrigger>
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
                          className={`flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer transition-all ${reviewFilter === value
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
                <Card className="p-8 border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Activity Logs
                  </h3>

                  <ActivityLogs />
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
