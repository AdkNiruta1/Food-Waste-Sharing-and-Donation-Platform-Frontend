import { Header } from "../../../../components/Header";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Clock, Shield, Mail, Phone, Calendar, UserCheck } from "lucide-react";

// Mock data
const pendingUsers = [
  { id: 1, name: "Rajesh Hamal", email: "rajesh@example.com", phone: "9841234567", role: "donor", submittedAt: "2025-04-01", documentsCount: 2 },
  { id: 2, name: "Sita Sharma", email: "sita.sharma@gmail.com", phone: "9803456789", role: "donor", submittedAt: "2025-04-02", documentsCount: 3 },
  { id: 3, name: "Bikram Thapa", email: "bikram.thapa@outlook.com", phone: "9812345678", role: "recipient", submittedAt: "2025-03-30", documentsCount: 2 },
];
const approvedUsers = [
  { id: 101, name: "Ramesh Prasad", email: "ramesh@example.com", phone: "9845678901", role: "donor", approvedAt: "2025-03-15", totalDonations: 12, rating: 4.8 },
  { id: 102, name: "Laxmi Devi", email: "laxmi.devi@gmail.com", phone: "9801234567", role: "recipient", approvedAt: "2025-03-20", totalRequests: 8, rating: 4.9 },
  { id: 103, name: "Hari Bahadur", email: "hari.bahadur@outlook.com", phone: "9812345678", role: "donor", approvedAt: "2025-04-01", totalDonations: 25, rating: 5.0 },
];

export default function AdminVerifiedUsers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // New: role filter

  const handleViewDetails = (user) => {
    navigate("/admin/verify-documents", {
      state: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          documents: {
            citizenship: "citizenship.pdf",
            pan: user.documentsCount >= 2 ? "pan.pdf" : null,
            drivingLicense: user.documentsCount === 3 ? "driving_license.jpg" : null,
          },
        },
      },
    });
  };

  const currentData = activeTab === "pending" ? pendingUsers : approvedUsers;

  const filteredData = currentData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">
            User Verifications
          </h1>
          <p className="text-slate-600 mt-2">
            Manage document verification and view approved accounts
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
                ? "text-green-600 border-green-600"
                : "text-slate-600 hover:text-slate-900 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5" />
              Pending ({pendingUsers.length})
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
              Approved ({approvedUsers.length})
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
              placeholder={`Search ${activeTab === "pending" ? "pending" : "approved"} users...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Role Filter Radio Buttons */}
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
        {filteredData.length === 0 ? (
          <Card className="p-16 text-center border-slate-200">
            <UserCheck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-lg text-slate-600">
              {searchTerm || roleFilter !== "all"
                ? "No matching users found"
                : activeTab === "pending"
                ? "No pending verifications"
                : "No approved users yet"}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((user) => (
              <Card
                key={user.id}
                className="p-6 border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      activeTab === "pending" ? "bg-orange-100" : "bg-green-100"
                    }`}>
                      {activeTab === "pending" ? (
                        <Clock className="h-7 w-7 text-orange-600" />
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
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {activeTab === "pending"
                        ? `Submitted: ${new Date(user.submittedAt).toLocaleDateString()}`
                        : `Approved: ${new Date(user.approvedAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                {activeTab === "pending" ? (
                  <>
                    <div className="pt-4 border-t border-slate-200 mb-5">
                      <p className="text-sm text-slate-600">
                        {user.documentsCount} document{user.documentsCount > 1 ? "s" : ""} submitted
                      </p>
                    </div>
                    <Button
                      onClick={() => handleViewDetails(user)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Review & Verify
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="pt-4 border-t border-slate-200 mb-5">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Activity</p>
                          <p className="font-semibold text-slate-900">
                            {user.role === "donor" ? `${user.totalDonations} donations` : `${user.totalRequests} requests`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Rating</p>
                          <p className="font-semibold text-green-600">★ {user.rating}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="border-slate-300">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-300">
                        Activity Log
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}