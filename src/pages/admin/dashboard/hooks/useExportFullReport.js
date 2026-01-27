import { useState, useContext } from "react";
import { exportFullReportService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useExportFullReport = () => {
  // Track export loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to export and download full app report
  const fetchExportFullReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await exportFullReportService();

      // Create and download ZIP file
      const blob = new Blob([response], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "full-app-report.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Full report exported successfully", "success");
    } catch (err) {
      // Handle export error
      setError(err.message);
      showToast(err.message || "Failed to export report", "error");
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Expose export API and state
  return { loading, error, fetchExportFullReport };
};
