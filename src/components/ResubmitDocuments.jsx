import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { Leaf, Upload, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useResubmit } from "../hooks/useResubmit";

// ── Moved OUTSIDE the parent component ────────────────────────────────────────
const UploadCard = ({ fileKey, label, required, recommended, files, errors, onFileChange }) => (
  <div>
    <Label className="text-base font-medium text-slate-900">
      {label}{" "}
      {required && <span className="text-red-600">*</span>}
      {recommended && <span className="text-slate-500 text-sm">(Recommended)</span>}
      {!required && !recommended && <span className="text-slate-500 text-sm">(Optional)</span>}
    </Label>
    <div className="mt-3">
      <label
        className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          errors[fileKey]
            ? "border-red-400 bg-red-50"
            : files[fileKey]
            ? "border-green-400 bg-green-50"
            : "border-slate-300 hover:border-green-500"
        }`}
      >
        {files[fileKey] ? (
          <img
            src={URL.createObjectURL(files[fileKey])}
            alt={`${fileKey} preview`}
            className="h-24 mx-auto object-contain rounded mb-3"
          />
        ) : (
          <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        )}
        <p className="font-medium text-slate-700 text-sm mb-1">
          {files[fileKey] ? files[fileKey].name : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e, fileKey)}
          className="hidden"
        />
      </label>
      {files[fileKey] && (
        <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {files[fileKey].name} selected
        </p>
      )}
      {errors[fileKey] && (
        <p className="text-xs text-red-500 mt-1">{errors[fileKey]}</p>
      )}
    </div>
  </div>
);

export default function ResubmitDocuments() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { resubmitUser, loading } = useResubmit();

  const [files, setFiles] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    pan: null,
    drivingLicense: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      if (errors[type]) setErrors((prev) => ({ ...prev, [type]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const hasFront = !!files.citizenshipFront;
    const hasBack = !!files.citizenshipBack;
    const hasOther = files.pan || files.drivingLicense;

    if (!hasFront && !hasBack && !hasOther) {
      newErrors.documents = "At least one document is required";
    } else if (hasFront && !hasBack) {
      newErrors.citizenshipBack = "Back side of citizenship is required";
    } else if (!hasFront && hasBack) {
      newErrors.citizenshipFront = "Front side of citizenship is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    if (files.citizenshipFront) formData.append("citizenshipFront", files.citizenshipFront);
    if (files.citizenshipBack) formData.append("citizenshipBack", files.citizenshipBack);
    if (files.pan) formData.append("pan", files.pan);
    if (files.drivingLicense) formData.append("drivingLicense", files.drivingLicense);

    try {
      await resubmitUser(formData, token);
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      // handled by hook
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-10 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
          <p className="text-slate-600">This resubmission link is invalid or has expired.</p>
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
            <p className="text-slate-600 mb-2">Thank you for resubmitting your documents.</p>
            <p className="text-sm text-slate-500">
              Our admin team will review them shortly. You'll receive an email once verification is complete.
            </p>
            <p className="text-xs text-slate-500 mt-6">Redirecting to login...</p>
          </Card>
        </div>
      </div>
    );
  }

  // Shared props passed down to every UploadCard
  const uploadProps = { files, errors, onFileChange: handleFileChange };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 container mx-auto max-w-4xl px-4 py-12">

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Leaf className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold text-slate-900">Resubmit Documents</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your previous document verification was not successful. Please upload clear, valid documents to regain access.
          </p>
        </div>

        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Action Required:</strong> Your account is currently restricted. You cannot log in until new valid documents are submitted and approved.
          </AlertDescription>
        </Alert>

        <Card className="p-8 lg:p-10 border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Upload Required Documents
                </h2>
                <p className="text-slate-600">
                  Upload at least one complete document. Citizenship requires both front and back.
                </p>
              </div>

              {errors.documents && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.documents}
                </p>
              )}

              {/* Citizenship — front + back */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-slate-50">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Citizenship Certificate
                    <span className="text-xs font-normal text-slate-500 ml-2">
                      (Both sides required if uploading)
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload the front and back of your citizenship card together
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UploadCard fileKey="citizenshipFront" label="Front Side" {...uploadProps} />
                  <UploadCard fileKey="citizenshipBack" label="Back Side" {...uploadProps} />
                </div>
              </div>

              <UploadCard fileKey="pan" label="PAN Card" recommended {...uploadProps} />
              <UploadCard fileKey="drivingLicense" label="Driving License" {...uploadProps} />
            </section>

            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Tips for successful verification:</strong>
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  <li>Use good lighting and a flat surface when taking photos</li>
                  <li>Ensure all corners and text are fully visible</li>
                  <li>Avoid glare, shadows, or cropped edges</li>
                  <li>Upload original documents only — no photocopies</li>
                </ul>
              </AlertDescription>
            </Alert>

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
                disabled={loading}
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