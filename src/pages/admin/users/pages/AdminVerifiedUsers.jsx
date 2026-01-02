import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Search, Clock, Shield, Mail, Phone, Calendar, UserCheck, XCircle } from "lucide-react";

import { useGetAllUsers } from "../hooks/useGetAllUsers";

export default function AdminVerifiedUsers() {
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
          role: user.role,
          status,
          rejectionReason: user.rejectionReason || null,
          documents: user.documents || {},
        },
      },
    });
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Verified Users
          </h1>
          <p className="text-slate-600 mt-2">
            Manage document verification and view approved/rejected accounts
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-8 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab("pending");
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 ${
              activeTab === "pending"
                ? "text-orange-400 border-b-orange-400"
                : "text-slate-600 hover:text-slate-900 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5" />
              Pending ({pendingCount})
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab("approved");
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 ${
              activeTab === "approved"
                ? "text-green-600 border-green-600"
                : "text-slate-600 hover:text-slate-900 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              Approved ({approvedCount})
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab("rejected");
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 ${
              activeTab === "rejected"
                ? "text-red-600 border-red-600"
                : "text-slate-600 hover:text-slate-900 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5" />
              Rejected ({rejectedCount})
            </div>
          </button>
        </div>
      </div>

      {/* Search + Role Filter */}
      <div className="container mx-auto max-w-6xl px-4 pb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              placeholder={`Search ${activeTab} users...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {["all", "donor", "recipient"].map((role) => (
              <label
                key={role}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border cursor-pointer transition-all ${
                  roleFilter === role
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white border-slate-300 hover:border-slate-400"
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
                <span className="capitalize font-medium">
                  {role === "all" ? "All Roles" : role + "s"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 pb-20">
        {loading ? (
          <Card className="p-16 text-center border-slate-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-4">Loading users...</p>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-16 text-center border-slate-200">
            {activeTab === "rejected" ? (
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            ) : activeTab === "pending" ? (
              <Clock className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            ) : (
              <UserCheck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            )}
            <p className="text-lg text-slate-600">
              {searchTerm || roleFilter !== "all"
                ? "No matching users found"
                : activeTab === "pending"
                ? "No pending verifications"
                : activeTab === "rejected"
                ? "No rejected users"
                : "No approved users yet"}
            </p>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => {
                const status = getUserStatus(user);

                return (
                  <Card
                    key={user._id || user.id}
                    className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          status === "pending" ? "bg-orange-100" :
                          status === "rejected" ? "bg-red-100" : "bg-green-100"
                        }`}>
                          {status === "pending" ? (
                            <Clock className="h-7 w-7 text-orange-600" />
                          ) : status === "rejected" ? (
                            <XCircle className="h-7 w-7 text-red-600" />
                          ) : (
                            <UserCheck className="h-7 w-7 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">
                            {user.name}
                          </h3>
                          <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {status === "pending"
                            ? `Submitted: ${new Date(user.createdAt).toLocaleDateString()}`
                            : status === "rejected"
                            ? `Rejected: ${user.rejectedAt ? new Date(user.rejectedAt).toLocaleDateString() : "N/A"}`
                            : `Approved: ${new Date(user.updatedAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>

                    {status === "pending" ? (
                      <>
                        <div className="pt-4 border-t border-slate-200 mb-5">
                          <p className="text-sm text-slate-600">
                            Documents submitted
                          </p>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(user)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Review & Verify
                        </Button>
                      </>
                    ) : status === "rejected" ? (
                      <>
                        <div className="pt-4 border-t border-slate-200 mb-5">
                          <p className="text-sm font-medium text-red-700">Reason:</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {user.rejectionReason || "Not specified"}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(user)}
                          variant="outline"
                          className="w-full border-red-300 text-red-700 hover:bg-red-50"
                        >
                          View Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="pt-4 border-t border-slate-200 mb-5">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs text-slate-500">Activity</p>
                              <p className="font-semibold text-slate-900">
                                {user.role === "donor" ? `${user.totalDonations || 0} donations` : `${user.totalRequests || 0} requests`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Rating</p>
                              <p className="font-semibold text-green-600">★ {user.rating || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" onClick={() => handleViewDetails(user)} size="sm">View Profile</Button>
                          <Button variant="outline" onClick={() => navigate("/admin/user/" + user._id + "/activity-logs")} className="border-green-300 text-green-700 hover:bg-green-50" size="sm">Activity Log</Button>
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}