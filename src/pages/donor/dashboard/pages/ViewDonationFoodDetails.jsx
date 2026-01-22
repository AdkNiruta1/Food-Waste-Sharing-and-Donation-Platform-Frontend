import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../../../components/Header";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useEffect } from "react";
import {
  MapPin,
  Clock,
  Package,
  Star,
  ArrowLeft,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetFoodDetails } from "../../../recipient/browser/hooks/useGetFoodDetails";

export default function DonorFoodDetail() {
  const { foodId } = useParams();
  const navigate = useNavigate();

  const { foods: post, loading, FoodDonationDetails } =
    useGetFoodDetails();

  useEffect(() => {
    FoodDonationDetails(foodId);
  }, [foodId]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-bold mb-4">Donation Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Back Button */}
      <div className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-green-600"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow">
            <img
              src={
                post.photo
                  ? IMAGE_URL + post.photo
                  : "https://via.placeholder.com/800x400"
              }
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Details */}
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-slate-600 mb-6">{post.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Info label="Quantity" value={`${post.quantity} ${post.unit}`} />
              <Info
                label="Expiry"
                value={new Date(post.expiryDate).toLocaleDateString()}
              />
              <Info label="Status" value={post.status} />
              <Info
                label="Posted"
                value={new Date(post.createdAt).toLocaleDateString()}
              />
            </div>

            {/* Pickup */}
            <Section title="Pickup Instructions" icon={Clock}>
              {post.pickupInstructions || "Contact donor after approval."}
            </Section>

            {/* Location */}
            <Section title="Pickup Location" icon={MapPin}>
              {post.city}, {post.district}
            </Section>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          <Card className="p-8 sticky top-24">
            {/* Donor Info */}
            <h3 className="font-semibold mb-4">Donated By</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <User className="text-green-600" />
              </div>
              <div>
                <p className="font-bold">{post?.donor?.name}</p>
                <p className="text-sm text-slate-500">
                  Member since{" "}
                  {new Date(post?.donor?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* 🧑‍🌾 Donor Actions */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600"
                  onClick={() =>
                    navigate(`/donor/food/${post._id}/requests`)
                  }
                >
                  View Requests
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    navigate(`/update-food/${post._id}`)
                  }
                >
                  Edit Donation
                </Button>
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Helper Components -------------------- */

const Info = ({ label, value }) => (
  <div className="bg-slate-50 p-4 rounded">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="mt-8">
    <h3 className="flex items-center gap-2 font-semibold mb-2">
      {Icon && <Icon className="h-5 w-5 text-green-600" />} {title}
    </h3>
    <p className="text-slate-600">{children}</p>
  </div>
);
