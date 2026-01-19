import { useState, useContext } from "react";
import { exportFullReportMonthlyService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useExportFullMonthlyReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchExportFullReportMonthly = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      // Create a new date for last month safely
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const month = lastMonthDate.getMonth() + 1; // 1–12
      const year = lastMonthDate.getFullYear();
console.log(month, year);
      const response = await exportFullReportMonthlyService(month, year);

      // ✅ Create blob URL
      const blob = new Blob([response], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      // ✅ Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "full-app-report-last-month.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Full report exported successfully", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to export report", "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchExportFullReportMonthly };
};
