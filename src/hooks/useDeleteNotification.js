import { useState, useContext } from "react";
import { deleteNotificationService } from "../services/notificationService";
import { AppContext } from "../context/ContextApp";

export const useDeleteNotification = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const deleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      await deleteNotificationService(notificationId);
      showToast("Notification deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete notification", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteNotification, loading };
};


