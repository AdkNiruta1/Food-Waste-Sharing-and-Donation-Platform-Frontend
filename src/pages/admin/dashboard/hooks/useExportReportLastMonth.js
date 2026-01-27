import { useState, useContext } from "react";
import { exportFullReportMonthlyService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useExportFullMonthlyReport = () => {
  // Track export loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global toast for success/error feedback
  const { showToast } = useContext(AppContext);

  // Main function to export and download last month's full report
  const fetchExportFullReportMonthly = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate last month safely
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const month = lastMonthDate.getMonth() + 1; // 1–12
      const year = lastMonthDate.getFullYear();

      const response = await exportFullReportMonthlyService(month, year);

      // Create and download ZIP file
      const blob = new Blob([response], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "full-app-report-last-month.zip";
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
  return { loading, error, fetchExportFullReportMonthly };
};
