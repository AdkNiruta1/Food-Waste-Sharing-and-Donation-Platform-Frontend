
import { useState } from "react";
import { notificationServices } from "../services/notificationService";
import { AppContext } from "../context/ContextApp";

export const useGetNotification = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({});
  const [count, setCount] = useState({});
  // const { showToast } = useContext(AppContext);

  const getNotifications = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await notificationServices(page, limit);
      setNotifications(res.data.notifications);
      setPagination(res.data.pagination);
      setCount(res.data.counts);
      return res.data;
    } catch (err) {
      // showToast(err.message || "Failed to fetch notifications", "error");
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getNotifications, count, loading, notifications, pagination };
};
