import { useState, useCallback } from "react";
import { getContactMessagesService } from "../services/contactServices";

export const useGetContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async ({ page = 1, limit = 10, search = "" } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getContactMessagesService(page, limit, search);
      setMessages(res.data.messages || []);
      setPagination(res.data.pagination);
      return res;
    } catch (err) {
      setError(err.message || "Failed to fetch messages");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { messages, pagination, loading, error, fetchMessages };
};
