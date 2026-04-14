import { useState, useContext } from "react";
import { exportUserAnalyticsService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useExportUserAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchExportUserAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await exportUserAnalyticsService();

      // ✅ Create PDF blob
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // ✅ Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.pdf"; // 👈 Correct filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Users PDF exported successfully", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to export users", "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchExportUserAnalytics };
};
