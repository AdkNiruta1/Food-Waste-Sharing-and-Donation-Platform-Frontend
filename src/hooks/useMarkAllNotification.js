import { useState, useContext } from "react";
import { markAllNotificationsAsReadService } from "../services/notificationService";
import { AppContext } from "../context/ContextApp";

export const useMarkNotification = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const markAllNotificationsAsRead = async () => {
    setLoading(true);
    try {
      await markAllNotificationsAsReadService();
      showToast("All notifications marked as read successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to mark all notifications as read", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markAllNotificationsAsRead, loading };
};


