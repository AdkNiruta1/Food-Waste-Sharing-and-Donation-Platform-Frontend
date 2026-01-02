
import { useState, useContext } from "react";
import { notificationServices } from "../services/notificationService";
import { AppContext } from "../context/ContextApp";

export const useGetNotification = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({});
  const { showToast } = useContext(AppContext);

  const getNotifications = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await notificationServices(page, limit);
      setNotifications(res.data.notifications);
      setPagination(res.data.pagination);
      showToast("Notifications fetched successfully", "success");
      return res.data;
    } catch (err) {
      showToast(err.message || "Failed to fetch notifications", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getNotifications, loading, notifications, pagination };
};
