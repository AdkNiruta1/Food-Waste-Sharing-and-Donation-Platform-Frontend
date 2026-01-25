import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  Mail, 
  Package, 
  Star, 
  AlertCircle,
  Clock,
  Check,
  RefreshCw,
  BellRing,
  ChevronRight,
  BellOff,
  Calendar,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Hash
} from "lucide-react";

import { useGetNotification } from "../hooks/useGetNotification";
import { useDeleteNotification } from "../hooks/useDeleteNotification";
import { useMarkNotification } from "../hooks/useMarkNotification";
import { useMarkAllNotification } from "../hooks/useMarkAllNotification";

export default function Notifications() {

  const { getNotifications,count, notifications, loading, pagination } = useGetNotification();
  const { deleteNotification } = useDeleteNotification();
  const { markNotificationAsRead } = useMarkNotification();
  const { markAllNotificationsAsRead } = useMarkAllNotification();

  const [tabValue, setTabValue] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [notificationsState, setNotificationsState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, tabValue]);

  useEffect(() => {
    setNotificationsState(notifications);
    if (pagination) {
      setTotalPages(pagination.totalPages || 1);
    }
  }, [notifications, pagination]);

  const fetchNotifications = () => {
    getNotifications(currentPage, 10);
  };
  const unreadNotificationsData = notifications.filter(n => !n.read);
  const readNotificationsData = notifications.filter(n => n.read);
  const unreadNotifications = count?.unseen
  const readNotifications = count?.seen;

  const getFilteredList = (tab) => {
    if (tab === "unread") return unreadNotificationsData;
    if (tab === "read") return readNotificationsData;
    return notificationsState;
  };

  const handleMarkAsRead = async (id) => {
    setActionLoading(true);
    await markNotificationAsRead(id);
    // Update local state immediately for better UX
    setNotificationsState(prev => 
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    );
    // Refetch notifications to get updated state
    fetchNotifications();
    setActionLoading(false);
    //reload window
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading(true);
    await markAllNotificationsAsRead();
    // Refetch notifications to get updated state
    fetchNotifications();
    setActionLoading(false);
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    await deleteNotification(id);
    // Update local state immediately
    setNotificationsState(prev => prev.filter(n => n._id !== id));
    setActionLoading(false);
    fetchNotifications();
  };

  // Extract notification type from message
  const extractNotificationType = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("food request")) return "request";
    if (msg.includes("rating")) return "rating";
    if (msg.includes("accepted")) return "approval";
    if (msg.includes("password")) return "alert";
    if (msg.includes("message")) return "message";
    if (msg.includes("delivery")) return "delivery";
    if (msg.includes("system")) return "system";
    return "info";
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "request":
      case "delivery":
        return <Package className="h-5 w-5" />;
      case "message":
        return <Mail className="h-5 w-5" />;
      case "rating":
        return <Star className="h-5 w-5" />;
      case "approval":
        return <CheckCircle className="h-5 w-5" />;
      case "alert":
        return <AlertCircle className="h-5 w-5" />;
      case "system":
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case "request":
      case "delivery":
        return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" };
      case "message":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "rating":
        return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      case "approval":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "alert":
        return { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" };
      case "system":
        return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };
    }
  };

  // Get notification label
  const getNotificationLabel = (type) => {
    switch (type) {
      case "request": return "Food Request";
      case "delivery": return "Delivery";
      case "message": return "Message";
      case "rating": return "Rating";
      case "approval": return "Approval";
      case "alert": return "Alert";
      case "system": return "System";
      default: return "Information";
    }
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateString).toLocaleDateString();
  };

  // Generate title from message
  const generateTitle = (message) => {
    if (message.includes("food request")) return "New Food Request";
    if (message.includes("rating")) return "New Rating Received";
    if (message.includes("accepted")) return "Request Accepted";
    if (message.includes("password")) return "Security Alert";
    return "Notification";
  };

  // Render actual notifications
  const renderNotificationList = (items) => (
    <div className="space-y-4">
      {items.length === 0 ? (
        <Card className="p-12 text-center border-slate-200/80 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 inline-flex mb-6">
            <BellOff className="h-20 w-20 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            No notifications found
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {tabValue === "all" 
              ? "All caught up! No new notifications"
              : tabValue === "unread" 
                ? "No unread notifications"
                : "No read notifications"}
          </p>
        </Card>
      ) : (
        items?.map((notification) => {
          const type = extractNotificationType(notification.message);
          const colors = getNotificationColor(type);
          const title = generateTitle(notification.message);
          
          return (
            <Card
              key={notification._id}
              className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/90 backdrop-blur-sm ${
                !notification.read 
                  ? `${colors.border} border-2 shadow-lg shadow-emerald-500/10` 
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Notification Icon */}
                <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} shadow-sm`}>
                  {getNotificationIcon(type)}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      )}
                    </div>
                    <Badge className={`${colors.bg} ${colors.text} capitalize`}>
                      {getNotificationLabel(type)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{getTimeAgo(notification.createdAt)}</span>
                      {notification.priority === "high" && (
                        <Badge className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60">
                {!notification.read ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification._id);
                    }}
                    disabled={actionLoading}
                    className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="flex-1 border-slate-300 text-slate-500 cursor-default"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification._id);
                  }}
                  disabled={actionLoading}
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );

  // Render skeletons
  const renderSkeletons = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-6 border-slate-200/80 rounded-2xl animate-pulse bg-white/90 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-200"></div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-5 w-16 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/4 bg-slate-200 rounded mt-2"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const filteredNotifications = getFilteredList(tabValue);

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">
            {(currentPage - 1) * 10 + 1}
          </span> to{" "}
          <span className="font-semibold text-slate-900">
            {Math.min(currentPage * 10, pagination?.total || 0)}
          </span> of{" "}
          <span className="font-semibold text-slate-900">{pagination?.total || 0}</span> notifications
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination?.hasPrev}
            onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1 mx-4">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            {endPage < totalPages && (
              <>
                <span className="px-2 text-slate-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            disabled={!pagination?.hasNext}
            onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg shadow-emerald-500/20">
                <BellRing className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{unreadNotifications}</span> unread
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{pagination?.total || 0}</span> total
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                  <div className="text-sm text-slate-600">
                    Page <span className="font-semibold text-slate-900">{currentPage}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {unreadNotifications > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  disabled={actionLoading || unreadNotifications === 0}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(1);
                  fetchNotifications();
                }}
                disabled={actionLoading}
                className="border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${actionLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 py-8 flex-1">
        {/* Tabs */}
        <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm mb-8">
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid grid-cols-3 bg-slate-100/80 p-1 rounded-xl w-full">
              <TabsTrigger 
                value="all" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                All ({pagination?.total || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Unread ({unreadNotifications})
              </TabsTrigger>
              <TabsTrigger 
                value="read" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Read ({readNotifications})
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-8">
              <TabsContent value="all" className="m-0">
                {loading ? renderSkeletons() : renderNotificationList(filteredNotifications)}
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                {loading ? renderSkeletons() : renderNotificationList(filteredNotifications)}
              </TabsContent>
              <TabsContent value="read" className="m-0">
                {loading ? renderSkeletons() : renderNotificationList(filteredNotifications)}
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}