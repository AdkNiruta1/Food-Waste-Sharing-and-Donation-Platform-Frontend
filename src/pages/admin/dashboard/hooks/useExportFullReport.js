import { useState, useContext } from "react";
import { exportFullReportService } from "../services/adminServices";
import { AppContext } from "../../../../context/ContextApp";

export const useExportFullReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const fetchExportFullReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await exportFullReportService();

      // Create blob URL
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "full-app-report.pdf";
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

  return { loading, error, fetchExportFullReport };
};
