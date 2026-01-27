import { useState, useContext } from "react";
import { exportUserAnalyticsService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useExportUserAnalytics = () => {
  // Track export loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to export and download users analytics CSV
  const fetchExportUserAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await exportUserAnalyticsService();

      // Create and download CSV file
      const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "users.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Users CSV exported successfully", "success");
    } catch (err) {
      // Handle export error
      setError(err.message);
      showToast(err.message || "Failed to export users", "error");
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose export API and state
  return { loading, error, fetchExportUserAnalytics };
};
