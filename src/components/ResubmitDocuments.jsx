import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { Leaf, Upload, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useResubmit } from "../hooks/useResubmit";

export default function ResubmitDocuments() {
 const navigate = useNavigate();
  const { token } = useParams(); // 🔥 resubmit token from URL
  const { resubmitUser, loading } = useResubmit();

  const [files, setFiles] = useState({
    citizenship: null,
    pan: null,
    drivingLicense: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  /* =========================
     SUBMIT HANDLER
  ========================== */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!files.citizenship) {
    return alert("Citizenship document is required");
  }

  const formData = new FormData();

  if (files.citizenship) {
    formData.append("citizenship", files.citizenship);
  }
  if (files.pan) {
    formData.append("pan", files.pan);
  }
  if (files.drivingLicense) {
    formData.append("drivingLicense", files.drivingLicense);
  }

  try {
    await resubmitUser(formData, token);
    setSubmitted(true);
    setTimeout(() => navigate("/login"), 3000);
  } catch {
    // toast handled by hook
  }
};

  if (!token) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-10 text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
        <p className="text-slate-600">
          This resubmission link is invalid or has expired.
        </p>
      </Card>
    </div>
  );
}

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <Card className="max-w-md w-full p-10 text-center border-slate-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Documents Submitted Successfully!
            </h2>
            <p className="text-slate-600 mb-2">
              Thank you for resubmitting your documents.
            </p>
            <p className="text-sm text-slate-500">
              Our admin team will review them shortly. You'll receive an email once verification is complete.
            </p>
            <p className="text-xs text-slate-500 mt-6">
              Redirecting to login...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Leaf className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Resubmit Documents
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your previous document verification was not successful. Please upload clear, valid documents to regain access to your account.
          </p>
        </div>

        {/* Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Action Required:</strong> Your account is currently restricted. You cannot log in until new valid documents are submitted and approved by our admin team.
          </AlertDescription>
        </Alert>

        <Card className="p-8 lg:p-10 border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Document Upload Section */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Upload Required Documents
                </h2>
                <p className="text-slate-600">
                  Please ensure documents are clear, in focus, and show all details completely.
                </p>
              </div>

              {/* Citizenship - Required */}
              <div>
                <Label className="text-base font-medium text-slate-900">
                  Citizenship Certificate <span className="text-red-600">*</span>
                </Label>
                <div className="mt-3">
                  <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="font-medium text-slate-700 mb-1">
                      {files.citizenship ? files.citizenship.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "citizenship")}
                      className="hidden"
                      required
                    />
                  </label>
                  {files.citizenship && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {files.citizenship.name} selected
                    </p>
                  )}
                </div>
              </div>

              {/* PAN Card - Optional but recommended */}
              <div>
                <Label className="text-base font-medium text-slate-900">
                  PAN Card <span className="text-slate-500 text-sm">(Recommended)</span>
                </Label>
                <div className="mt-3">
                  <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="font-medium text-slate-700 mb-1">
                      {files.pan ? files.pan.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "pan")}
                      className="hidden"
                    />
                  </label>
                  {files.pan && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {files.pan.name} selected
                    </p>
                  )}
                </div>
              </div>

              {/* Driving License - Optional */}
              <div>
                <Label className="text-base font-medium text-slate-900">
                  Driving License <span className="text-slate-500 text-sm">(Optional)</span>
                </Label>
                <div className="mt-3">
                  <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="font-medium text-slate-700 mb-1">
                      {files.drivingLicense ? files.drivingLicense.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "drivingLicense")}
                      className="hidden"
                    />
                  </label>
                  {files.drivingLicense && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {files.drivingLicense.name} selected
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Tips */}
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Tips for successful verification:</strong>
                <ul className="mt-2 list-disc list-inside text-sm">
                  <li>Use good lighting and a flat surface when taking photos</li>
                  <li>Ensure all corners and text are fully visible</li>
                  <li>Avoid glare, shadows, or cropped edges</li>
                  <li>Upload original documents only</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                className="px-8 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !files.citizenship}
                className="px-10 bg-red-600 hover:bg-red-700"
              >
                  {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}