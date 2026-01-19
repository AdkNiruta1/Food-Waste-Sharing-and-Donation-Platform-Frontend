import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import {
  Leaf,
  Star,
  Phone,
  Mail,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetUserById } from "../../../admin/users/hooks/useGetUserById";
import { useEffect } from "react";

export default function ViewRecipientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    user: Recipient,
    loading: RecipientLoading,
    error: RecipientError,
    fetchUserById
  } = useGetUserById();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id]);

  /* ================= LOADING ================= */
  if (RecipientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading Recipient details...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (RecipientError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Error loading Recipient details: {RecipientError}
        </p>
      </div>
    );
  }

  /* ================= NO DATA ================= */
  if (!Recipient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Recipient details not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-2xl w-full p-10 border-slate-200">
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Recipient Details
            </h1>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-4">
              {Recipient.profilePicture ? (
                <img
                  src={`${IMAGE_URL}${Recipient.profilePicture}`}
                  alt={Recipient.name}
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <UserCheck className="h-14 w-14 text-green-600" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              {Recipient.name}
            </h2>

            <p className="text-sm text-slate-600 capitalize">
              {Recipient.role}
            </p>

            {Recipient.accountVerified === "verified" && (
              <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
                <UserCheck className="h-4 w-4" />
                Verified Recipient
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="h-5 w-5 text-green-600" />
              <span>{Recipient.email}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="h-5 w-5 text-green-600" />
              <span>{Recipient.phone}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <p className="text-slate-700">
                <span className="font-semibold">
                  {Recipient.rating ?? 0}
                </span>
                /5 rating
                <span className="text-sm text-slate-500 ml-2">
                  ({Recipient.ratingCount ?? 0} reviews)
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <a href={`tel:${Recipient.phone}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Phone className="mr-2 h-5 w-5" />
                Call Recipient
              </Button>
            </a>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
