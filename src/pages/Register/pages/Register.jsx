import { Header } from "../../../components/Header";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { register, loading, error } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "recipient",
    documents: {
      citizenship: null,
      pan: null,
      drivingLicense: null,
    },
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files?.[0];
      if (name === "profileImage") {
        setFormData({ ...formData, profileImage: file || null });
      } else if (name in formData.documents) {
        setFormData({
          ...formData,
          documents: {
            ...formData.documents,
            [name]: file || null,
          },
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Check for documents if hotel or needs verification
    if (formData.role === "donor") {
      if (!formData.documents.citizenship && !formData.documents.pan && !formData.documents.drivingLicense) {
        newErrors.documents = "At least one form of ID is required";
      }
    } else {
      if (!formData.documents.citizenship && !formData.documents.pan && !formData.documents.drivingLicense) {
        newErrors.documents = "At least one form of ID is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (step === 1) {
    if (validateStep1()) setStep(2);
    return;
  }

  if (!validateStep2()) return;

  if (!agreedToTerms) {
    setErrors({ terms: "You must agree to the terms" });
    return;
  }

  try {
    const formDataPayload = new FormData();

    // Basic fields
    formDataPayload.append("name", formData.name);
    formDataPayload.append("email", formData.email);
    formDataPayload.append("password", formData.password);
    formDataPayload.append("role", formData.role);
    formDataPayload.append("phone", formData.phone);
    formDataPayload.append("address", formData.address);

    // Profile image
    if (formData.profileImage) {
      formDataPayload.append("profilePicture", formData.profileImage);
    }

    // Documents (at least one required)
    if (formData.documents.citizenship) {
      formDataPayload.append("citizenship", formData.documents.citizenship);
    }
    if (formData.documents.pan) {
      formDataPayload.append("pan", formData.documents.pan);
    }
    if (formData.documents.drivingLicense) {
      formDataPayload.append("drivingLicense", formData.documents.drivingLicense);
    }

    await register(formDataPayload);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-2xl w-full p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Annapurna Bhandar</h1>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Create Account</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Step {step} of 2 - {step === 1 ? "Basic Information" : "Documents & Verification"}
          </p>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the errors below before continuing
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">I want to:</Label>
                  <div className="space-y-2">
                    <label
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors"
                      style={{
                        borderColor: formData.role === "donor" ? "green" : "#d1d5db", // default gray border
                      }}
                    >
                      <input
                        type="radio"
                        value="donor"
                        checked={formData.role === "donor"}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">Share Food</div>
                        <div className="text-xs text-muted-foreground">
                          Post surplus food donations
                        </div>
                      </div>
                    </label>

                    <label
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors"
                      style={{
                        borderColor: formData.role === "recipient" ? "green" : "#d1d5db",
                      }}
                    >
                      <input
                        type="radio"
                        value="recipient"
                        checked={formData.role === "recipient"}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">Receive Food</div>
                        <div className="text-xs text-muted-foreground">
                          Browse and request donations
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9841000000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Jhumka, Sunsari, Nepal"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-10"
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Verification Documents * (Upload at least one)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Submit citizenship, PAN, or driving license for verification
                  </p>

                  <div className="space-y-2">
                    <div className="border border-border rounded-lg p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="file"
                          name="citizenship"
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Citizenship Certificate</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.documents.citizenship
                              ? formData.documents.citizenship.name
                              : "Click to upload"}
                          </p>
                        </div>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="file"
                          name="pan"
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">PAN Card</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.documents.pan ? formData.documents.pan.name : "Click to upload"}
                          </p>
                        </div>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="file"
                          name="drivingLicense"
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Driving License</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.documents.drivingLicense
                              ? formData.documents.drivingLicense.name
                              : "Click to upload"}
                          </p>
                        </div>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </div>
                  </div>
                  {errors.documents && (
                    <p className="text-xs text-red-500">{errors.documents}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked && errors.terms) {
                        setErrors({ ...errors, terms: "" });
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground">
                    I agree to the{" "}
                    <Link to="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
              </>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                  Back
                </Button>
              )}
              {( loading ) ? (
                <Button type="button" className={step === 1 ? "w-full" : "flex-1"} disabled>
                  Processing...
                </Button>
              ) : (
             <Button type="submit" className={step === 1 ? "w-full" : "flex-1"}>
                {step === 1 ? "Continue" :  "Create Account"}
              </Button>
              )}
            </div>
              {error && (<div className="text-sm text-red-500 mt-2">{error}</div>)}

          </form>

          <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
