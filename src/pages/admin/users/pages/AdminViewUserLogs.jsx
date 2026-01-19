import { Header } from "../../../../components/Header";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  LogIn,
  KeyRound,
  User,
  Clock,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Activity,
  Filter,
} from "lucide-react";
import { useGetUserLogs } from "../hooks/useGetUserLogs";

// Helper to get relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

// Enhanced action styling with gradients
const getActionStyles = (action = "") => {
  const a = action.toLowerCase();

  if (a.includes("approved") || a.includes("verified")) {
    return {
      badge: "bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-800",
      border: "border-l-4 border-emerald-500",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      titleColor: "text-emerald-800",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
    };
  }
  if (a.includes("rejected")) {
    return {
      badge: "bg-gradient-to-r from-rose-50 to-rose-100/50 text-rose-800",
      border: "border-l-4 border-rose-500",
      icon: <AlertTriangle className="h-5 w-5 text-rose-600" />,
      titleColor: "text-rose-800",
      gradient: "from-rose-500 to-rose-600",
      iconBg: "bg-rose-100",
    };
  }
  if (a.includes("resubmitted")) {
    return {
      badge: "bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-800",
      border: "border-l-4 border-amber-500",
      icon: <RefreshCw className="h-5 w-5 text-amber-600" />,
      titleColor: "text-amber-800",
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
    };
  }
  if (a.includes("registered")) {
    return {
      badge: "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-800",
      border: "border-l-4 border-blue-500",
      icon: <UserPlus className="h-5 w-5 text-blue-600" />,
      titleColor: "text-blue-800",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
    };
  }
  if (a.includes("login")) {
    return {
      badge: "bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-800",
      border: "border-l-4 border-indigo-500",
      icon: <LogIn className="h-5 w-5 text-indigo-600" />,
      titleColor: "text-indigo-800",
      gradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100",
    };
  }
  if (a.includes("password")) {
    return {
      badge: "bg-gradient-to-r from-purple-50 to-purple-100/50 text-purple-800",
      border: "border-l-4 border-purple-500",
      icon: <KeyRound className="h-5 w-5 text-purple-600" />,
      titleColor: "text-purple-800",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
    };
  }
  if (a.includes("profile")) {
    return {
      badge: "bg-gradient-to-r from-teal-50 to-teal-100/50 text-teal-800",
      border: "border-l-4 border-teal-500",
      icon: <User className="h-5 w-5 text-teal-600" />,
      titleColor: "text-teal-800",
      gradient: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-100",
    };
  }

  return {
    badge: "bg-gradient-to-r from-slate-50 to-slate-100/50 text-slate-800",
    border: "border-l-4 border-slate-400",
    icon: <FileText className="h-5 w-5 text-slate-600" />,
    titleColor: "text-slate-800",
    gradient: "from-slate-500 to-slate-600",
    iconBg: "bg-slate-100",
  };
};

export default function AdminUserActivityLogs() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { logs, pagination, loading, fetchUserLogsById } = useGetUserLogs();
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (userId) {
      fetchUserLogsById(userId, page, 10);
    }
  }, [userId, page]);

  const filteredLogs = selectedFilter === "all"
    ? logs
    : logs.filter(log => {
      const action = log.action.toLowerCase();
      if (selectedFilter === "verification") return action.includes("approved") || action.includes("rejected") || action.includes("verified");
      if (selectedFilter === "security") return action.includes("logged") || action.includes("password");
      if (selectedFilter === "profile") return action.includes("profile") || action.includes("resubmitted");
      return true;
    });

  const filterOptions = [
    { value: "all", label: "All Activities", count: pagination?.total },
    { value: "verification", label: "Verification", icon: <Shield className="h-4 w-4" /> },
    { value: "security", label: "Security", icon: <KeyRound className="h-4 w-4" /> },
    { value: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-xl border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Activity Logs
                  </h1>
                  <p className="text-slate-600 mt-1 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Complete audit trail for user actions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600 bg-slate-100/80 px-4 py-2 rounded-full">
                <span className="font-semibold text-slate-900">{logs.length}</span> total logs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 flex-1">
        {/* Filter Section */}
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-slate-500" />
              <h3 className="font-semibold text-slate-900">Filter Activities</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${selectedFilter === filter.value
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                    : "bg-white border-slate-300/80 hover:border-slate-400 hover:shadow-sm"
                    }`}
                >
                  {filter.icon}
                  <span className="font-medium text-sm">{filter.label}</span>
                  {filter.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${selectedFilter === filter.value
                      ? "bg-white/20"
                      : "bg-slate-100 text-slate-700"
                      }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading activity logs...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching user audit trail</p>
          </Card>
        ) : filteredLogs.length === 0 ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="p-6 rounded-2xl bg-slate-100 inline-flex mb-6">
              <Activity className="h-20 w-20 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No activity found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {selectedFilter !== "all"
                ? "No activities match the selected filter"
                : "This user has no logged activities yet"}
            </p>
          </Card>
        ) : (
          <>
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-12 top-20 bottom-12 w-1 bg-gradient-to-b from-emerald-300 via-slate-300 to-emerald-300 hidden lg:block"></div>

              {/* Activity Cards */}
              <div className="space-y-8">
                {filteredLogs.map((log, index) => {
                  const styles = getActionStyles(log.action);
                  const isFirst = index === 0;
                  const isLast = index === filteredLogs.length - 1;

                  return (
                    <div key={log._id} className="relative flex gap-6 group">
                      {/* Timeline Icon */}
                      <div className="relative z-10 flex-shrink-0 hidden lg:block">
                        <div className={`w-10 h-10 rounded-full ${styles.iconBg} border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          {styles.icon}
                        </div>
                        {/* Decorative dots */}
                        {!isFirst && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                        )}
                        {!isLast && (
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                        )}
                      </div>

                      {/* Mobile Icon */}
                      <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center lg:hidden shadow-sm`}>
                        {styles.icon}
                      </div>

                      {/* Log Card */}
                      <Card className={`flex-1 ${styles.border} border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group-hover:border-opacity-100`}>
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge className={`${styles.badge} font-semibold`}>
                                  {log.action}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(log.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              {/* User Details */}
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-xl bg-slate-50/80">
                                    <p className="text-xs text-slate-500 font-semibold mb-1">PERFORMED BY</p>
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-emerald-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-900">
                                          {log.performedBy?.name || "System"}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                          {log.performedBy?.email || "system@admin.com"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {log?.targetUser && (
                                    <div className="p-4 rounded-xl bg-slate-50/80">
                                      <p className="text-xs text-slate-500 font-semibold mb-1">TARGET USER</p>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-slate-900">
                                            {log.targetUser.name}
                                          </p>
                                          <p className="text-sm text-slate-600">
                                            {log.targetUser.email}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Additional Details */}
                                {log.details && (
                                  <div className="p-4 rounded-xl bg-slate-50/80">
                                    <p className="text-xs text-slate-500 font-semibold mb-2">DETAILS</p>
                                    <p className="text-sm text-slate-700">{log.details}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Timestamp */}
                            <div className="lg:text-right">
                              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">
                                  {formatRelativeTime(log.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(page * 10, pagination.total)}
                  </span> of{" "}
                  <span className="font-semibold text-slate-900">{pagination.total}</span> activities
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage(p => p - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${page === pageNum
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
                    disabled={!pagination.hasNext}
                    onClick={() => setPage(p => p + 1)}
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