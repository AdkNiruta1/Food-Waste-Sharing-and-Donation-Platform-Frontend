import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Bell, CheckCircle, Inbox, Trash2 } from "lucide-react";

import { useGetNotification } from "../hooks/useGetNotification";
import { useDeleteNotification } from "../hooks/useDeleteNotification";
import { useMarkNotification } from "../hooks/useMarkNotification";
import { useMarkAllNotification } from "../hooks/useMarkAllNotification";

export default function Notifications() {
  const navigate = useNavigate();

  const { getNotifications, notifications, loading } = useGetNotification();
  const { deleteNotification } = useDeleteNotification();
  const { markNotificationAsRead } = useMarkNotification();
  const { markAllNotificationsAsRead } = useMarkAllNotification();


  const [tabValue, setTabValue] = useState("all"); // control tabs

  useEffect(() => {
    getNotifications();
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const getFilteredList = (tab) => {
    let list = notifications;
    if (tab === "unread") list = unreadNotifications;
    if (tab === "read") list = readNotifications;
    return list;
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    getNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    getNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    getNotifications();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) await handleMarkAsRead(notification._id);

    switch (notification.type) {
      case "request":
      case "approval":
      case "delivery":
        navigate(`/food/${notification.relatedId}`);
        break;
      case "message":
        navigate("/messages");
        break;
      case "rating":
        navigate(`/profile/${notification.relatedId}`);
        break;
      default:
        break;
    }
  };

  // Render actual notifications
  const renderNotificationList = (items) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <Card className="p-12 text-center border-slate-200">
          <Inbox className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-lg text-slate-600">No notifications here</p>
        </Card>
      ) : (
        items.map((notification) => (
          <Card
            key={notification.id}
            className={`p-5 border-slate-200 cursor-pointer transition-all hover:shadow-md ${
              !notification.read ? "bg-green-50 border-green-200" : "bg-white"
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-3 h-3 rounded-full bg-green-600 flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification._id);
                    }}
                    className="text-green-600 hover:bg-green-100"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification._id);
                  }}
                  className="text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  // Render skeletons
  const renderSkeletons = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-5 border-slate-200 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 w-3/4 bg-slate-300 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 rounded mt-1" />
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <div className="h-5 w-5 bg-slate-300 rounded" />
              <div className="h-5 w-5 bg-slate-300 rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <Bell className="h-10 w-10 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
              <p className="text-slate-600 mt-1">
                {unreadNotifications.length} unread message
                {unreadNotifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {unreadNotifications.length > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead} className="border-slate-300">
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-slate-100">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
            <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">{loading ? renderSkeletons() : renderNotificationList(getFilteredList("all"))}</TabsContent>
          <TabsContent value="unread">{loading ? renderSkeletons() : renderNotificationList(getFilteredList("unread"))}</TabsContent>
          <TabsContent value="read">{loading ? renderSkeletons() : renderNotificationList(getFilteredList("read"))}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
