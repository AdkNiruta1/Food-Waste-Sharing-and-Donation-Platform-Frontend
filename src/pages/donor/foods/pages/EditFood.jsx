import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { MapPin, Upload, Leaf } from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetFoodDetails } from "../../../recipient/browser/hooks/useGetFoodDetails";
import { useUpdatePost } from "../hooks/useUpdatePost";

const FOOD_TYPES = [
  { value: "cooked", label: "🍲 Cooked Food" },
  { value: "other", label: "📦 Other" },
];

const UNITS = ["kg", "lbs", "items", "portions", "liters", "bottles"];

const DISTRICTS = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Kavre", "Nuwakot",
  "Sunsari", "Kaski", "Morang", "Illam"
];

const CITIES = {
  Kathmandu: ["Kathmandu", "Thamel", "Baneshwor", "Koteshwor", "Maharajgunj"],
  Lalitpur: ["Patan", "Pulchowk", "Jawalakhel", "Kupondole"],
  Bhaktapur: ["Bhaktapur", "Thimi", "Suryabinayak"],
  Kavre: ["Dhulikhel", "Banepa"],
  Nuwakot: ["Bidur"],
  Sunsari: ["Dharan", "Itahari"],
  Kaski: ["Pokhara"],
  Morang: ["Biratnagar"],
  Illam: ["Illam"]
};

export default function EditFood() {
  const { foodId } = useParams();
  const navigate = useNavigate();

  const { foods: post, FoodDonationDetails, loading } = useGetFoodDetails();
  const { updatePost, updating } = useUpdatePost();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "cooked",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    district: "",
    city: "",
    pickupInstructions: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  /* Fetch food */
  useEffect(() => {
    FoodDonationDetails(foodId);
  }, [foodId]);

  /* Populate form */
  useEffect(() => {
    if (!post) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      title: post.title,
      description: post.description,
      type: post.type,
      quantity: post.quantity,
      unit: post.unit,
      expiryDate: post.expiryDate?.split("T")[0],
      district: post.district,
      city: post.city,
      pickupInstructions: post.pickupInstructions,
      photo: null,
    });
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "district") {
        updated.city = CITIES[value]?.[0] || "";
      }
      return updated;
    });
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleFileChange = (file) => {
    if (file) setFormData((prev) => ({ ...prev, photo: file }));
  };

  const validate = () => {
    const e = {};
    if (!formData.title) e.title = "Title required";
    if (!formData.description) e.description = "Description required";
    if (!formData.quantity || formData.quantity <= 0) e.quantity = "Invalid quantity";
    if (!formData.expiryDate) e.expiryDate = "Expiry date required";
    if (!formData.pickupInstructions) e.pickupInstructions = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await updatePost(foodId, formData);
    if (res) navigate("/donor-dashboard");
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <Leaf className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold">Edit Food Donation</h1>
          </div>
          <p className="text-slate-600">
            Update details of your food donation
          </p>
        </div>

        <Card className="p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Food Details */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Food Details</h2>

              <div>
                <Label>Food Title *</Label>
                <Input name="title" value={formData.title} onChange={handleChange} />
                {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
              </div>

              <div>
                <Label>Description *</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Type */}
              <div>
                <Label className="font-semibold">Food Type *</Label>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {FOOD_TYPES.map((t) => (
                    <label
                      key={t.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer ${formData.type === t.value
                          ? "border-green-600 bg-green-50"
                          : "border-slate-300"
                        }`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        checked={formData.type === t.value}
                        onChange={() => handleTypeChange(t.value)}
                      />
                      {t.label}
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
            </section>
            {/* Location */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="text-green-600" />
                <h2 className="text-2xl font-bold">Pickup Location</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                >
                  {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                >
                  {(CITIES[formData.district] || []).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
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

            <hr />

            {/* Photo */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Update Photo</h2>

              {post?.photo && (
                <img
                  src={IMAGE_URL + post.photo}
                  className="h-40 rounded mb-4"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="cursor-pointer"
              />
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600">
                {updating ? "Updating..." : "Update Donation"}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}
