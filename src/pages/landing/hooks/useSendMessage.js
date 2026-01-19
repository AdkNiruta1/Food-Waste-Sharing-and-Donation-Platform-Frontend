import { useState, useContext } from "react";
import { contactService } from "../services/contactService";
import { AppContext } from "../../../context/ContextApp";

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const sendMessage = async (data) => {
    setLoading(true);
    try {
      const res = await contactService(data);
      showToast("Message sent successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Sending failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
