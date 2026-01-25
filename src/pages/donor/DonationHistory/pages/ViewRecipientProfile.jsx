// components/popups/ViewRecipientPopup.jsx
import { Activity, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "../../../../components/ui/dialog";
import { 
  Star, 
  Phone, 
  Mail, 
  UserCheck, 
  MapPin, 
  Calendar,
  Shield,
  Award,
  Users,
  Package,
  Heart,
  X,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { IMAGE_URL } from "../../../../constants/constants";
import { useGetUserById } from "../../../admin/users/hooks/useGetUserById";

export const ViewRecipientPopup = ({ 
  isOpen, 
  onClose, 
  recipientId,
}) => {
  const { user, loading, error ,fetchUserById} = useGetUserById();

  useEffect(() => {
    if (isOpen && recipientId) {
      fetchUserById(recipientId);
    }
  }, [isOpen, recipientId]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'donor': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'recipient': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'admin': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= (rating || 0)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      );
    }
    return stars;
  };

  if (loading ) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading recipient details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error ) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="py-16 text-center">
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/60 inline-flex mb-4">
              <X className="h-12 w-12 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Profile</h3>
            <p className="text-slate-600">{error }</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-linear-to-br from-blue-100 to-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                
                <DialogTitle className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Recipient Profile
                </DialogTitle>
                <p className="text-slate-600">View complete recipient information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </DialogHeader>

        <DialogBody>
          {error ? (
            <div className="p-6 text-center">
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/60 inline-flex mb-4">
                <X className="h-12 w-12 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Profile</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          ) : user ? (
            <div className="space-y-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                    {user.profilePicture ? (
                      <img
                        src={`${IMAGE_URL}${user.profilePicture}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <UserCheck className="h-12 w-12 text-blue-600" />
                      </div>
                    )}
                  </div>
                  {user.accountVerified === "verified" && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                      <Badge className={`${getRoleColor(user.role)} text-white mt-2`}>
                        {user.role === 'recipient' ? 'Food Recipient' : user.role}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(user.rating)}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-slate-900">{user.rating || "0.0"}</p>
                        <p className="text-xs text-slate-500">({user.ratingCount || 0} reviews)</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600">{user.bio || "No bio provided"}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-5 rounded-2xl border-slate-200/80 bg-linear-to-br from-slate-50 to-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-slate-500" />
                    Contact Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="font-medium text-slate-900">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="font-medium text-slate-900">{user.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="font-medium text-slate-900">{user.address || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Statistics */}
                <Card className="p-5 rounded-2xl border-slate-200/80 bg-linear-to-br from-slate-50 to-white">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-slate-500" />
                    Recipient Statistics
                  </h3>
                  <div className="space-y-4">
                    {/* <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Requests Made</p>
                          <p className="font-bold text-slate-900">{user.totalRequests || 0}</p>
                        </div>
                      </div>
                    </div> */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Member Since</p>
                          <p className="font-bold text-slate-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Award className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Account Status</p>
                          <Badge className={getStatusColor(user.accountVerified)}>
                            {user.accountVerified?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-6 rounded-2xl bg-slate-100 inline-flex mb-6">
                <Users className="h-20 w-20 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recipient Not Found</h3>
              <p className="text-slate-600">The recipient details could not be loaded</p>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          {user && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-slate-300 hover:border-slate-400"
              >
                Close
              </Button>
              {user.phone && (
                <a href={`tel:${user.phone}`}>
                  <Button className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Recipient
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                onClick={() => window.location.href = `mailto:${user.email}`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};