import { useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Package,
  AlertCircle,
  Trash2,
  Inbox,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const initialNotifications = [
  {
    id: "1",
    type: "request",
    title: "New Food Request",
    message: "Anita Sharma requested your Fresh Tomatoes donation",
    relatedId: "1",
    relatedName: "Anita Sharma",
    read: false,
    createdAt: "2025-04-01T10:30:00Z",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "2",
    type: "approval",
    title: "Request Accepted",
    message: "Your request for Bakery Items has been accepted by Priya Patel",
    relatedId: "2",
    relatedName: "Priya Patel",
    read: false,
    createdAt: "2025-04-01T09:15:00Z",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "Ramesh Thapa sent you a message about pickup timing",
    relatedId: "3",
    relatedName: "Ramesh Thapa",
    read: true,
    createdAt: "2025-03-31T14:20:00Z",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: "4",
    type: "rating",
    title: "New Rating",
    message: "Neha Verma rated you 5 stars for your dairy products donation",
    relatedId: "5",
    relatedName: "Neha Verma",
    read: true,
    createdAt: "2025-03-30T16:45:00Z",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    id: "5",
    type: "delivery",
    title: "Pickup Reminder",
    message: "Your request for Organic Apples expires in 2 hours",
    relatedId: "4",
    relatedName: "Maya Gurung",
    read: true,
    createdAt: "2025-03-29T12:00:00Z",
    icon: <Package className="h-5 w-5" />,
  },
];

const NOTIFICATION_TYPES = [
  { value: "all", label: "All Notifications" },
  { value: "request", label: "Requests" },
  { value: "approval", label: "Approvals" },
  { value: "message", label: "Messages" },
  { value: "rating", label: "Ratings" },
  { value: "delivery", label: "Reminders" },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications] = useState(initialNotifications);
  const [typeFilter, setTypeFilter] = useState("all");

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const filteredByType = notifications.filter((n) =>
    typeFilter === "all" ? true : n.type === typeFilter
  );

  const getFilteredList = (tab) => {
    let list = notifications;
    if (tab === "unread") list = unreadNotifications;
    if (tab === "read") list = readNotifications;

    return list.filter((n) =>
      typeFilter === "all" ? true : n.type === typeFilter
    );
  };

  const handleMarkAsRead = (id) => {
    // In real app: update state or backend
  };

  const handleMarkAllAsRead = () => {
    // In real app: mark all as read
  };

  const handleDelete = (id) => {
    // In real app: delete notification
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
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

  const renderNotificationList = (items) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <Card className="p-12 text-center border-slate-200">
          <Inbox className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-lg text-slate-600">
            No notifications here
          </p>
        </Card>
      ) : (
        items.map((notification) => (
          <Card
            key={notification.id}
            className={`p-5 border-slate-200 cursor-pointer transition-all hover:shadow-md ${
              !notification.read
                ? "bg-green-50 border-green-200"
                : "bg-white"
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                notification.type === "message" || notification.type === "delivery"
                  ? "bg-orange-100 text-orange-700"
                  : notification.type === "rating"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              } flex-shrink-0`}>
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {notification.message}
                    </p>
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
                      handleMarkAsRead(notification.id);
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
                    handleDelete(notification.id);
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <Bell className="h-10 w-10 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Notifications
                </h1>
                <p className="text-slate-600 mt-1">
                  {unreadNotifications.length} unread message{unreadNotifications.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {unreadNotifications.length > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="border-slate-300"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Type Filter + Tabs */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Notification Type Filter - Radio Buttons */}
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-700 mb-4">Filter by type:</p>
          <div className="flex flex-wrap gap-3">
            {NOTIFICATION_TYPES.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer transition-all ${
                  typeFilter === value
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="typeFilter"
                  value={value}
                  checked={typeFilter === value}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-slate-100">
            <TabsTrigger value="all">
              All ({filteredByType.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.filter(n => typeFilter === "all" || n.type === typeFilter).length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({readNotifications.filter(n => typeFilter === "all" || n.type === typeFilter).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderNotificationList(getFilteredList("all"))}
          </TabsContent>
          <TabsContent value="unread">
            {renderNotificationList(getFilteredList("unread"))}
          </TabsContent>
          <TabsContent value="read">
            {renderNotificationList(getFilteredList("read"))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}