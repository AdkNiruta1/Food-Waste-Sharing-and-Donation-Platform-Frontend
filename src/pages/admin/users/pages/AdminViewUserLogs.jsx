import { Header } from "../../../../components/Header";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
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

// Enhanced action styling
const getActionStyles = (action = "") => {
  const a = action.toLowerCase();

  if (a.includes("approved") || a.includes("verified")) {
    return {
      badge: "bg-green-100 text-green-700",
      border: "border-l-4 border-green-500",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      titleColor: "text-green-800",
    };
  }
  if (a.includes("rejected")) {
    return {
      badge: "bg-red-100 text-red-700",
      border: "border-l-4 border-red-500",
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      titleColor: "text-red-800",
    };
  }
  if (a.includes("resubmitted")) {
    return {
      badge: "bg-orange-100 text-orange-700",
      border: "border-l-4 border-orange-500",
      icon: <RefreshCw className="h-5 w-5 text-orange-600" />,
      titleColor: "text-orange-800",
    };
  }
  if (a.includes("registered")) {
    return {
      badge: "bg-blue-100 text-blue-700",
      border: "border-l-4 border-blue-500",
      icon: <UserPlus className="h-5 w-5 text-blue-600" />,
      titleColor: "text-blue-800",
    };
  }
  if (a.includes("login")) {
    return {
      badge: "bg-indigo-100 text-indigo-700",
      border: "border-l-4 border-indigo-500",
      icon: <LogIn className="h-5 w-5 text-indigo-600" />,
      titleColor: "text-indigo-800",
    };
  }
  if (a.includes("password")) {
    return {
      badge: "bg-purple-100 text-purple-700",
      border: "border-l-4 border-purple-500",
      icon: <KeyRound className="h-5 w-5 text-purple-600" />,
      titleColor: "text-purple-800",
    };
  }
  if (a.includes("profile")) {
    return {
      badge: "bg-teal-100 text-teal-700",
      border: "border-l-4 border-teal-500",
      icon: <User className="h-5 w-5 text-teal-600" />,
      titleColor: "text-teal-800",
    };
  }

  return {
    badge: "bg-slate-100 text-slate-700",
    border: "border-l-4 border-slate-400",
    icon: <FileText className="h-5 w-5 text-slate-600" />,
    titleColor: "text-slate-800",
  };
};

export default function AdminUserActivityLogs() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { logs, pagination, loading, fetchUserLogsById } = useGetUserLogs();

  useEffect(() => {
    if (userId) {
      fetchUserLogsById(userId, page, 10);
    }
  }, [userId, page]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                User Activity Logs
              </h1>
              <p className="text-slate-600 mt-1">
                Complete action history for this user
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-slate-300 bg-white">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No activity recorded
            </h3>
            <p className="text-slate-500">
              This user has no logged actions yet.
            </p>
          </Card>
        ) : (
          <>
            {/* Timeline */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-10 top-16 bottom-8 w-0.5 bg-slate-200 hidden md:block"></div>

              <div className="space-y-8">
                {logs.map((log) => {
                  const styles = getActionStyles(log.action);

                  return (
                    <div key={log._id} className="relative flex gap-6">
                      {/* Icon Circle */}
                      <div className={`relative z-10 p-3 rounded-full ${styles.badge} flex-shrink-0 hidden md:flex items-center justify-center`}>
                        {styles.icon}
                      </div>

                      {/* Mobile icon (smaller) */}
                      <div className={`p-2.5 rounded-full ${styles.badge} flex-shrink-0 md:hidden`}>
                        {styles.icon}
                      </div>

                      {/* Log Card */}
                      <div className={`flex-1 ${styles.border} bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={`text-lg font-semibold ${styles.titleColor}`}>
                                {log.action}
                              </h3>

                              <div className="mt-4 space-y-3 text-sm">
                                <div className="flex flex-wrap items-center gap-2 text-slate-600">
                                  <User className="h-4 w-4" />
                                  <span className="font-medium">Performed by:</span>
                                  <span className="text-slate-900">
                                    {log.performedBy?.name || "System"} ({log.performedBy?.email || "N/A"})
                                  </span>
                                </div>

                                {log.targetUser && (
                                  <div className="flex flex-wrap items-center gap-2 text-slate-600">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Target user:</span>
                                    <span className="text-slate-900">
                                      {log.targetUser.name} ({log.targetUser.email})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Timestamp */}
                            <div className="text-sm text-slate-500 flex items-center gap-2 self-start sm:self-center">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                {formatRelativeTime(log.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(p => p - 1)}
                  className="min-w-[120px]"
                >
                  Previous
                </Button>

                <div className="text-slate-700 font-medium">
                  Page <span className="text-green-600 font-bold">{pagination.page}</span> of {pagination.totalPages}
                </div>

                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(p => p + 1)}
                  className="min-w-[120px]"
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