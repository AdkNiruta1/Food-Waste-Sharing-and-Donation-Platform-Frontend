import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { MapPin, Upload, Leaf } from "lucide-react";
import { useCreatePost } from '../hooks/useCreatePost'
const FOOD_TYPES = [
  { value: "cooked", label: "🍲 Cooked Food" },
  { value: "other", label: "📦 Other" }, // optional for anything else
];

const UNITS = ["kg", "lbs", "items", "portions", "liters", "bottles"];

const DISTRICTS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kavre",
  "Nuwakot",
  "Sunsari",
  "Kaski",
  "Morang",
  "Illam"
];

const CITIES = {
  Kathmandu: ["Kathmandu", "Thamel", "Baneshwor", "Koteshwor", "Maharajgunj"],
  Lalitpur: ["Patan", "Pulchowk", "Jawalakhel", "Kupondole"],
  Bhaktapur: ["Bhaktapur", "Suryabinayak", "Thimi"],
  Kavre: ["Dhulikhel", "Banepa", "Panauti"],
  Nuwakot: ["Bidur", "Trishuli"],
  Sunsari: ["Dharan", "Itahari", "Inaruwa"],
  Kaski: ["Pokhara", "Lekhnath"],
  Morang: ["Biratnagar", "Rangeli", "Letang"],
  Illam: ["Illam", "Fikkal", "Suryodaya"]
};


export default function CreateFood() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "vegetables",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    district: "Kathmandu",
    city: "Kathmandu",
    pickupInstructions: "",
    geoLocation: { lat: null, lng: null }, // <-- new
  });

  const [errors, setErrors] = useState({});
  const { createPost, loading } = useCreatePost();
  const fetchGeoLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setFormData((prev) => ({ ...prev, geoLocation: coords }));
          resolve(coords);
        },
        (error) => {
          console.error("Error fetching location:", error);
          reject(error);
        }
      );
    });
  };
  const [sendLoading, setsendLoading] = useState(false);
  const handleFileChange = (file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const handleChange = (
    e
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "district") {
        updated.city = CITIES[value]?.[0] || "";
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }
    if (!formData.pickupInstructions.trim())
      newErrors.pickupInstructions = "Pickup instructions are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // first prevent default
    setsendLoading(true); // then show loading

    if (!validateForm()) {
      setsendLoading(false); // stop loading if validation fails
      return;
    }

    let coords;
    try {
      coords = await fetchGeoLocation(); // wait for location
    } catch (err) {
      console.warn("Location not fetched, continuing without it.");
      coords = { lat: null, lng: null };
    }

    try {
      await createPost({ ...formData, geoLocation: coords });
      navigate("/donor-dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setsendLoading(false); // always reset loading
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 container mx-auto max-w-4xl px-4 py-12">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <Leaf className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Share Your Surplus Food
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Help reduce food waste by donating to those in need in your community.
          </p>
        </div>

        <Card className="p-8 lg:p-10 border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Food Details Section */}
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Food Details
                </h2>
                <p className="text-slate-600">
                  Provide clear information about what you're donating
                </p>
              </div>

              <div className="grid gap-6">
                <div>
                  <Label htmlFor="title">Food Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Fresh Organic Tomatoes, Homemade Dal Bhat"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-2"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe condition, ingredients, preparation date, storage, etc. Be honest and detailed."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full mt-2 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Food Type - Radio Buttons */}
                <div>
                  <Label className="text-base font-semibold text-slate-900">Food Type *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {FOOD_TYPES.map(({ value, label }) => (
                      <label
                        key={value}
                        className={`flex items-center justify-center gap-3 p-5 rounded-lg border-2 cursor-pointer transition-all ${formData.type === value
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-slate-300 hover:border-slate-400 bg-white"
                          }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={value}
                          checked={formData.type === value}
                          onChange={() => handleTypeChange(value)}
                          className="sr-only"
                        />
                        <span className="text-lg">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      step="0.5"
                      placeholder="10"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="mt-2"
                    />
                    {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit *</Label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full mt-2 h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-900"
                    >
                      {UNITS.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Best Before / Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-2"
                    />
                    {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Location & Pickup Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-7 w-7 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Pickup Location
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="district">District *</Label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full mt-2 h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-900"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="city">City / Area *</Label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full mt-2 h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-900"
                  >
                    {CITIES[formData.district]?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="pickupInstructions">Pickup Instructions *</Label>
                <textarea
                  id="pickupInstructions"
                  name="pickupInstructions"
                  placeholder="Available times, who to contact, entrance instructions, etc."
                  value={formData.pickupInstructions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-2 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 resize-none focus:ring-2 focus:ring-green-600"
                />
                {errors.pickupInstructions && (
                  <p className="text-red-600 text-sm mt-1">{errors.pickupInstructions}</p>
                )}
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Photo Upload */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Upload className="h-7 w-7 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">Add Photo (Optional)</h2>
              </div>

              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById("food-photo").click()} // open file picker
                onDragOver={(e) => e.preventDefault()} // allow drag
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(e.dataTransfer.files[0]);
                }}
              >
                <Upload className="h-14 w-14 text-slate-400 mx-auto mb-4" />
                <p className="font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">PNG, JPG up to 10MB · Helps recipients see the food</p>

                {/* Hidden file input */}
                <input
                  id="food-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </div>

              {formData.photo && (
                <p className="mt-2 text-green-700">Selected file: {formData.photo.name}</p>
              )}
            </section>


            {/* Submit */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
                className="px-8 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="px-10 bg-green-600 hover:bg-green-700"
              >
                {loading || sendLoading ? "Loading..." : "Post Donation"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}