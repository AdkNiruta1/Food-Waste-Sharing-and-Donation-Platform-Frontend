import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogSection, DialogFooter } from "../../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../../components/ui/alert-dialog";
import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Trash2, Filter, Calendar, MapPin, Users, Package, Clock, User, Phone, Mail, Shield, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, ExternalLink, Award, Heart, Star } from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useDeleteFoodPost } from "../hooks/useDeleteFoodPost";
import { useGetFoodPost } from "../hooks/useGetFoodPost";
import { DialogClose } from "@radix-ui/react-dialog";

export default function AdminManageFoodPosts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { foods: allPosts, pagination, loading, fetchFoodPost } = useGetFoodPost();
  const { loading: deleteLoading, deletePost } = useDeleteFoodPost();

  // Fetch ALL posts
  const loadPosts = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm || undefined,
    };
    fetchFoodPost(params);
  }, [currentPage, searchTerm, fetchFoodPost]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, districtFilter]);

  // Get unique districts for filter
  const uniqueDistricts = [...new Set(allPosts.map(post => post.district).filter(Boolean))];

  // Get unique types for filter
  const uniqueTypes = [...new Set(allPosts.map(post => post.type).filter(Boolean))];

  // Filter posts based on criteria
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.donor?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesType = typeFilter === "all" || post.type === typeFilter;
    const matchesDistrict = districtFilter === "all" || post.district === districtFilter;

    return matchesSearch && matchesStatus && matchesType && matchesDistrict;
  });

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return { bg: "bg-emerald-100 text-emerald-800", icon: <Package className="h-3 w-3" /> };
      case 'accepted':
        return { bg: "bg-blue-100 text-blue-800", icon: <CheckCircle className="h-3 w-3" /> };
      case 'completed':
        return { bg: "bg-purple-100 text-purple-800", icon: <Award className="h-3 w-3" /> };
      case 'expired':
        return { bg: "bg-amber-100 text-amber-800", icon: <Clock className="h-3 w-3" /> };
      default:
        return { bg: "bg-slate-100 text-slate-800", icon: <Package className="h-3 w-3" /> };
    }
  };

  // Type badge styling
  const getTypeBadge = (type) => {
    switch (type) {
      case 'cooked':
        return { bg: "bg-orange-100 text-orange-800", label: "Cooked Meal" };
      case 'packaged':
        return { bg: "bg-cyan-100 text-cyan-800", label: "Packaged" };
      case 'raw':
        return { bg: "bg-lime-100 text-lime-800", label: "Raw Food" };
      case 'other':
        return { bg: "bg-slate-100 text-slate-800", label: "Other" };
      default:
        return { bg: "bg-slate-100 text-slate-800", label: type };
    }
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setDetailsModalOpen(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await deletePost(postToDelete._id);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      loadPosts();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffHours = Math.floor((expiry - now) / (1000 * 60 * 60));

    if (diffHours <= 0) return "Expired";
    if (diffHours < 24) return `${diffHours}h left`;
    return `${Math.floor(diffHours / 24)}d left`;
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Manage Food Posts
              </h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Monitor, review, and manage all food donation posts in the system
              </p>
            </div>
            <div className="text-sm text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full">
              Total Posts: {allPosts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Posts
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by title, donor, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-slate-300/80"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300/80 bg-white focus:border-emerald-400 focus:ring-emerald-400/20"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Food Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300/80 bg-white focus:border-emerald-400 focus:ring-emerald-400/20"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type === 'cooked' ? 'Cooked Meal' :
                      type === 'packaged' ? 'Packaged Food' :
                        type === 'raw' ? 'Raw Food' : 'Other'}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                District
              </label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300/80 bg-white focus:border-emerald-400 focus:ring-emerald-400/20"
              >
                <option value="all">All Districts</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusFilter !== "all" && (
              <Badge className="bg-emerald-100 text-emerald-800">
                Status: {statusFilter}
              </Badge>
            )}
            {typeFilter !== "all" && (
              <Badge className="bg-blue-100 text-blue-800">
                Type: {typeFilter}
              </Badge>
            )}
            {districtFilter !== "all" && (
              <Badge className="bg-purple-100 text-purple-800">
                District: {districtFilter}
              </Badge>
            )}
            {searchTerm && (
              <Badge className="bg-amber-100 text-amber-800">
                Search: "{searchTerm}"
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 pb-20 flex-1">
        {loading ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading food posts...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching donation data</p>
          </Card>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="p-6 rounded-2xl bg-slate-100 inline-flex mb-6">
              <Package className="h-20 w-20 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No food posts found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || districtFilter !== "all"
                ? "No posts match your current filters"
                : "No food donation posts have been created yet"}
            </p>
          </Card>
        ) : (
          <>
            {/* Modern Table */}
            <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-br from-slate-50 to-slate-100/50 border-b border-slate-200/60">
                    <tr>
                      <th className="text-left py-5 px-6 font-semibold text-slate-900 text-sm uppercase tracking-wider">
                        Food Details
                      </th>
                      <th className="text-left py-5 px-6 font-semibold text-slate-900 text-sm uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="text-left py-5 px-6 font-semibold text-slate-900 text-sm uppercase tracking-wider">
                        Location
                      </th>
                      <th className="text-left py-5 px-6 font-semibold text-slate-900 text-sm uppercase tracking-wider">
                        Status & Requests
                      </th>
                      <th className="text-left py-5 px-6 font-semibold text-slate-900 text-sm uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="text-left py-5 px-6 font-semibold text-slate-900 text-sm uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {filteredPosts.map((post) => {
                      const statusBadge = getStatusBadge(post.status);
                      const typeBadge = getTypeBadge(post.type);
                      const timeRemaining = getTimeRemaining(post.expiryDate);
                      const isExpired = timeRemaining === "Expired";

                      return (
                        <tr
                          key={post._id}
                          className="hover:bg-slate-50/80 transition-colors duration-150 group"
                        >
                          {/* Food Details */}
                          <td className="py-5 px-6">
                            <div className="flex items-start gap-4">
                              {post.photo && (
                                <div className="shrink-0">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                                    <img
                                      src={`${IMAGE_URL}${post.photo}`}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-slate-900 truncate">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                  {post.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={`${typeBadge.bg} text-xs font-medium`}>
                                    {typeBadge.label}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <Package className="h-3 w-3" />
                                    <span>{post.quantity} {post.unit}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Donor Info */}
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              {post.donor?.profilePicture ? (
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-200">
                                  <img
                                    src={`${IMAGE_URL}${post.donor.profilePicture}`}
                                    alt={post.donor.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-emerald-600" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-slate-900">
                                  {post.donor?.name}
                                </p>
                                <p className="text-sm text-slate-500 truncate max-w-45">
                                  {post.donor?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                              <div>
                                <p className="font-medium text-slate-900">
                                  {post.city}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {post.district}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status & Requests */}
                          <td className="py-5 px-6">
                            <div className="space-y-2">
                              <Badge className={`${statusBadge.bg} inline-flex items-center gap-1`}>
                                {statusBadge.icon}
                                <span className="capitalize">{post.status}</span>
                              </Badge>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span className="font-medium text-slate-900">
                                  {post.requests?.length || 0} requests
                                </span>
                                {post.acceptedRequest && (
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                                    ✓ Accepted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Expiry */}
                          <td className="py-5 px-6">
                            <div className={`flex items-center gap-2 ${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                              <Calendar className="h-4 w-4" />
                              <div>
                                <p className="font-medium">
                                  {formatDate(post.expiryDate)}
                                </p>
                                <p className={`text-sm ${isExpired ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                                  {timeRemaining}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(post)}
                                className="border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(post)}
                                className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">
                    {(currentPage - 1) * 10 + 1}
                  </span> to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(currentPage * 10, pagination?.total || 0)}
                  </span> of{" "}
                  <span className="font-semibold text-slate-900">{pagination?.total || 0}</span> posts
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === pageNum
                              ? "bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                              : "text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Food Post Details Modal */}
      {/* Food Post Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-6xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle>Food Post Details</DialogTitle>
                <DialogDescription>
                  Complete information about this food donation
                </DialogDescription>
              </DialogHeader>

              <DialogBody>
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column - Food Details */}
                  <DialogSection>
                    {/* Food Image */}
                    {selectedPost.photo && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={`${IMAGE_URL}${selectedPost.photo}`}
                          alt={selectedPost.title}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Food Information */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Food Information
                        </h4>
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-slate-500">Title</p>
                              <p className="font-semibold text-slate-900 text-lg">{selectedPost.title}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Description</p>
                              <p className="text-slate-700">{selectedPost.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-500">Type</p>
                                <Badge className={`mt-1 ${getTypeBadge(selectedPost.type).bg}`}>
                                  {getTypeBadge(selectedPost.type).label}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Quantity</p>
                                <p className="font-semibold text-slate-900">
                                  {selectedPost.quantity} {selectedPost.unit}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Pickup Instructions</p>
                              <p className="text-slate-700">{selectedPost.pickupInstructions}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location & Expiry */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Location & Timing
                        </h4>
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {selectedPost.city}, {selectedPost.district}
                                </p>
                                {selectedPost.lat && selectedPost.lng && (
                                  <p className="text-sm text-slate-500 mt-1">
                                    Coordinates: {selectedPost.lat.toFixed(6)}, {selectedPost.lng.toFixed(6)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-slate-400 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-slate-500">Expiry Date</p>
                                <p className="font-semibold text-slate-900">
                                  {formatDate(selectedPost.expiryDate)}
                                  <span className={`ml-2 text-sm ${getTimeRemaining(selectedPost.expiryDate) === "Expired"
                                      ? "text-rose-600"
                                      : "text-emerald-600"
                                    }`}>
                                    ({getTimeRemaining(selectedPost.expiryDate)})
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-slate-500">Created</p>
                                <p className="font-semibold text-slate-900">
                                  {formatDate(selectedPost.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogSection>

                  {/* Right Column - Donor & Requests */}
                  <DialogSection>
                    {/* Donor Information */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                          Donor Information
                        </h4>
                        <Badge className={`${getStatusBadge(selectedPost.status).bg}`}>
                          {selectedPost.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                        <div className="flex items-center gap-4 mb-6">
                          {selectedPost.donor?.profilePicture ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm">
                              <img
                                src={`${IMAGE_URL}${selectedPost.donor.profilePicture}`}
                                alt={selectedPost.donor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                              <User className="h-8 w-8 text-emerald-600" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-lg text-slate-900">
                              {selectedPost.donor?.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${star <= (selectedPost.donor?.rating || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-slate-200 text-slate-200"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-600">
                                {selectedPost.donor?.rating || "0.0"} ({selectedPost.donor?.ratingCount || 0})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Email</p>
                              <p className="font-medium text-slate-900">{selectedPost.donor?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Phone</p>
                              <p className="font-medium text-slate-900">{selectedPost.donor?.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Address</p>
                              <p className="font-medium text-slate-900">{selectedPost.donor?.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                            <Shield className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500">Account Status</p>
                              <Badge className={
                                selectedPost.donor?.accountVerified === "verified"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : selectedPost.donor?.accountVerified === "rejected"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-amber-100 text-amber-800"
                              }>
                                {selectedPost.donor?.accountVerified?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requests List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                          Food Requests ({selectedPost.requests?.length || 0})
                        </h4>
                        {selectedPost.acceptedRequest && (
                          <Badge className="bg-emerald-100 text-emerald-800">
                            ✓ Request Accepted
                          </Badge>
                        )}
                      </div>

                      {selectedPost.requests?.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPost.requests.map((request) => (
                            <div
                              key={request._id}
                              className={`p-4 rounded-xl border ${request._id === selectedPost.acceptedRequest
                                  ? 'border-emerald-200 bg-emerald-50/50'
                                  : request.status === 'rejected'
                                    ? 'border-rose-200 bg-rose-50/50'
                                    : 'border-slate-200 bg-slate-50/50'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {request.receiver?.profilePicture ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                                      <img
                                        src={`${IMAGE_URL}${request.receiver.profilePicture}`}
                                        alt={request.receiver.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-slate-900">
                                      {request.receiver?.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {request.receiver?.email}
                                    </p>
                                  </div>
                                </div>
                                <Badge className={
                                  request._id === selectedPost.acceptedRequest
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : request.status === 'rejected'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-blue-100 text-blue-800'
                                }>
                                  {request._id === selectedPost.acceptedRequest
                                    ? 'ACCEPTED'
                                    : request.status?.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-slate-500">Requested</p>
                                  <p className="font-medium text-slate-900">
                                    {formatDate(request.requestedAt)}
                                  </p>
                                </div>
                                {request.acceptedAt && (
                                  <div>
                                    <p className="text-slate-500">Accepted</p>
                                    <p className="font-medium text-slate-900">
                                      {formatDate(request.acceptedAt)}
                                    </p>
                                  </div>
                                )}
                                {request.completedAt && (
                                  <div>
                                    <p className="text-slate-500">Completed</p>
                                    <p className="font-medium text-slate-900">
                                      {formatDate(request.completedAt)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 rounded-xl bg-slate-50/80 border border-slate-200/60">
                          <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-600">No requests yet</p>
                          <p className="text-xs text-slate-500 mt-1">
                            This food post hasn't received any requests
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogSection>
                </div>
              </DialogBody>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-slate-300 hover:border-slate-400">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleDeleteClick(selectedPost);
                  }}
                  variant="outline"
                  className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400"
                >
                  Delete Post
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <img src={IMAGE_URL + postToDelete?.photo} alt={postToDelete?.title} className="w-full h-full object-cover"/>
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold text-slate-900">
              Delete Food Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-600">
              Are you sure you want to delete "{postToDelete?.title}"?
              This action cannot be undone and will remove all associated requests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl border-slate-300 hover:border-slate-400">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="flex-1 bg-linear-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl"
            >
              {deleteLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Deleting...
                </div>
              ) : (
                "Delete Post"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}