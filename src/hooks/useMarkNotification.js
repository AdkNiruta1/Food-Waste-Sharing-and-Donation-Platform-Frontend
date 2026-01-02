import { useState, useContext } from "react";
import { markNotificationAsReadService } from "../services/notificationService";
import { AppContext } from "../context/ContextApp";

export const useMarkNotification = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const markNotificationAsRead = async (notificationId) => {
    setLoading(true);
    try {
      await markNotificationAsReadService(notificationId);
      showToast("Notification marked as read successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to mark notification as read", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markNotificationAsRead, loading };
};


