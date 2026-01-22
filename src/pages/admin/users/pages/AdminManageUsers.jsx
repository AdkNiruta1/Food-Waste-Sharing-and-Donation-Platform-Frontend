import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Search, Clock, Shield, Mail, Phone, Calendar, UserCheck, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

import { useGetAllUsers } from "../hooks/useGetAllUsers";

export default function AdminManageUsers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { users: allUsers, pagination, loading, fetchUsers } = useGetAllUsers();

  // Fetch ALL users (no status filter from backend)
  const loadUsers = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 9,
      role: roleFilter === "all" ? undefined : roleFilter,
      search: searchTerm || undefined,
    };
    fetchUsers(params);
  }, [currentPage, roleFilter, searchTerm, fetchUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeTab, searchTerm, roleFilter]);

  // Frontend-only classification
  const getUserStatus = (user) => {
    if (user.accountVerified === "verified") return "approved";
    if (user.accountVerified === "rejected") return "rejected"; // assuming you add this field later
    return "pending"; // default: not verified and no rejection
  };

  // Filter users based on active tab (frontend logic)
  const filteredUsers = allUsers.filter((user) => {
    const status = getUserStatus(user);
    const matchesTab = activeTab === status;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    return matchesTab && matchesRole && matchesSearch;
  });

  // Count for tabs
  const pendingCount = allUsers.filter(u => getUserStatus(u) === "pending").length;
  const approvedCount = allUsers.filter(u => getUserStatus(u) === "approved").length;
  const rejectedCount = allUsers.filter(u => getUserStatus(u) === "rejected").length;

  const handleViewDetails = (user) => {
    const status = getUserStatus(user);
    navigate("/admin/verify-documents", {
      state: {
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture,
          accountVerified: user.accountVerified,
          status,
          rating: user.rating || 0,
          ratingCount: user.ratingCount || 0,
          rejectionReason: user.rejectionReason || null,
          documents: user.documents || {},
        },
      },
    });
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p className="text-slate-500 mt-2 max-w-2xl">
                Review document verification, manage accounts, and monitor user activity
              </p>
            </div>
            <div className="text-sm text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full">
              Total Users: {allUsers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap gap-4 md:gap-8 border-b border-slate-200/60">
          <button
            onClick={() => {
              setActiveTab("pending");
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className={`pb-4 px-1 font-semibold text-base transition-all relative group ${activeTab === "pending"
                ? "text-amber-600"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeTab === "pending"
                  ? "bg-amber-100"
                  : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start">
                <span>Pending</span>
                <span className={`text-sm font-normal ${activeTab === "pending" ? "text-amber-600" : "text-slate-500"
                  }`}>
                  {pendingCount} waiting
                </span>
              </div>
            </div>
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("approved");
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className={`pb-4 px-1 font-semibold text-base transition-all relative group ${activeTab === "approved"
                ? "text-emerald-600"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeTab === "approved"
                  ? "bg-emerald-100"
                  : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start">
                <span>Approved</span>
                <span className={`text-sm font-normal ${activeTab === "approved" ? "text-emerald-600" : "text-slate-500"
                  }`}>
                  {approvedCount} verified
                </span>
              </div>
            </div>
            {activeTab === "approved" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("rejected");
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className={`pb-4 px-1 font-semibold text-base transition-all relative group ${activeTab === "rejected"
                ? "text-rose-600"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeTab === "rejected"
                  ? "bg-rose-100"
                  : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                <XCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start">
                <span>Rejected</span>
                <span className={`text-sm font-normal ${activeTab === "rejected" ? "text-rose-600" : "text-slate-500"
                  }`}>
                  {rejectedCount} declined
                </span>
              </div>
            </div>
            {activeTab === "rejected" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-rose-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Search + Filter Section */}
      <div className="container mx-auto max-w-7xl px-6 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder={`Search ${activeTab} users by name, email, or phone...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-base rounded-xl border-slate-300/80 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "donor", "recipient"].map((role) => (
              <label
                key={role}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${roleFilter === role
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-emerald-sm shadow-lg shadow-emerald-500/20"
                    : "bg-white border-slate-300/80 hover:border-slate-400 hover:shadow-sm"
                  }`}
              >
                <input
                  type="radio"
                  name="roleFilter"
                  value={role}
                  checked={roleFilter === role}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="sr-only"
                />
                <span className="capitalize font-semibold text-sm">
                  {role === "all" ? "All Roles" : role + "s"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-6 pb-20 flex-1">
        {loading ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading users...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching user data from database</p>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className={`p-6 rounded-2xl inline-flex mb-6 ${activeTab === "rejected" ? "bg-rose-100" :
                activeTab === "pending" ? "bg-amber-100" : "bg-slate-100"
              }`}>
              {activeTab === "rejected" ? (
                <XCircle className="h-20 w-20 text-rose-500" />
              ) : activeTab === "pending" ? (
                <Clock className="h-20 w-20 text-amber-500" />
              ) : (
                <UserCheck className="h-20 w-20 text-slate-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {searchTerm || roleFilter !== "all"
                ? "No matching users found"
                : activeTab === "pending"
                  ? "No pending verifications"
                  : activeTab === "rejected"
                    ? "No rejected users"
                    : "No approved users yet"}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "New users will appear here once they register"}
            </p>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => {
                const status = getUserStatus(user);
                const statusColors = {
                  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" },
                  rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: "text-rose-500" },
                  approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-500" }
                };
                const colors = statusColors[status];

                return (
                  <Card
                    key={user._id || user.id}
                    className={`p-6 rounded-2xl border ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm`}
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center shadow-sm`}>
                          {status === "pending" ? (
                            <Clock className="h-7 w-7 text-amber-600" />
                          ) : status === "rejected" ? (
                            <XCircle className="h-7 w-7 text-rose-600" />
                          ) : (
                            <UserCheck className="h-7 w-7 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 truncate max-w-[180px]">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                              {status.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/80">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700 truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/80">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{user.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/80">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">
                          {status === "pending"
                            ? `Submitted: ${new Date(user.createdAt).toLocaleDateString()}`
                            : status === "rejected"
                              ? `Rejected: ${user.rejectedAt ? new Date(user.rejectedAt).toLocaleDateString() : "N/A"}`
                              : `Approved: ${new Date(user.updatedAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Content Based on Status */}
                    {status === "pending" ? (
                      <>
                        <div className="pt-5 border-t border-slate-200/60 mb-6">
                          <p className="text-sm font-medium text-slate-900">Documents submitted</p>
                          <p className="text-xs text-slate-500 mt-1">Ready for review</p>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(user)}
                          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200"
                        >
                          Review & Verify
                        </Button>
                      </>
                    ) : status === "rejected" ? (
                      <>
                        <div className="pt-5 border-t border-slate-200/60 mb-6">
                          <p className="text-sm font-medium text-rose-700">Rejection Reason</p>
                          <p className="text-sm text-slate-600 mt-2 bg-rose-50/80 p-3 rounded-lg">
                            {user.rejectionReason || "No reason provided"}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(user)}
                          variant="outline"
                          className="w-full h-12 border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400 font-semibold rounded-xl transition-all duration-200"
                        >
                          View Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="pt-5 border-t border-slate-200/60 mb-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-emerald-50/80">
                              <p className="text-xs text-emerald-600 font-semibold">ACTIVITY</p>
                              <p className="font-bold text-slate-900 mt-1">
                                {user.role === "donor" ? `${user.donationCount || 0} donations` : `${user.requestCount || 0} requests`}
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-50/80">
                              <p className="text-xs text-amber-600 font-semibold">RATING</p>
                              <p className="font-bold text-slate-900 mt-1 flex items-center gap-1">
                                ★ {user.rating || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={() => handleViewDetails(user)}
                            variant="outline"
                            className="border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-medium rounded-lg"
                          >
                            View Profile
                          </Button>
                          <Button
                            onClick={() => navigate("/admin/user/" + user._id + "/activity-logs")}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-sm shadow-emerald-500/20"
                          >
                            Activity Log
                          </Button>
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="text-sm text-slate-600">
                  Showing page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}