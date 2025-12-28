import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Edit2, Mail, Phone, MapPin, FileText, Star, Award, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const mockUsers= {
  "d1": {
    id: "d1",
    name: "Raj Kumar",
    email: "raj@example.com",
    phone: "9841000001",
    role: "donor",
    rating: 4.8,
    totalRatings: 24,
    bio: "Passionate about reducing food waste and helping the community. Regular donor of fresh vegetables and cooked meals.",
    location: "Thamel, Kathmandu",
    joinedDate: "2024-01-15",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    verificationStatus: "verified",
    documents: {
      citizenship: true,
      pan: true,
      drivingLicense: false,
    },
    stats: {
      donations: 48,
      completed: 45,
      cancelled: 2,
    },
  },
  "rec1": {
    id: "rec1",
    name: "Anita Sharma",
    email: "anita@example.com",
    phone: "9841000002",
    role: "recipient",
    rating: 4.5,
    totalRatings: 12,
    bio: "Grateful community member helping to feed my family. Always respectful and punctual.",
    location: "Kathmandu",
    joinedDate: "2024-02-20",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verificationStatus: "verified",
    documents: {
      citizenship: true,
      pan: false,
      drivingLicense: false,
    },
    stats: {
      requests: 18,
      completed: 16,
      cancelled: 1,
    },
  },
};

export default function UserProfile() {
  const { userId = "d1" } = useParams();
  const user = mockUsers[userId] || mockUsers["d1"];
  const isCurrentUser = true; // In real app, check if viewing own profile

  return (
    <div className="min-h-screen flex flex-col bg-background">
      

      <div className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
          <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                />
                {user.verificationStatus === "verified" && (
                  <div className="absolute bottom-0 right-0 bg-success rounded-full p-2">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl font-bold text-foreground">{user.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="font-bold text-foreground">{user.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({user.totalRatings} ratings)
                      </span>
                    </div>
                    <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {user.role === "donor" ? "Food Donor" : "Food Recipient"}
                    </div>
                  </div>
                </div>
              </div>

              {isCurrentUser && (
                <Button>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="p-6 border-border">
                <h3 className="font-bold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium text-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground">{user.location}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Verification Status */}
              <Card className="p-6 border-border">
                <h3 className="font-bold text-foreground mb-4">Verification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Citizenship</span>
                    {user.documents.citizenship ? (
                      <Shield className="h-5 w-5 text-success" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PAN Card</span>
                    {user.documents.pan ? (
                      <Shield className="h-5 w-5 text-success" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Driving License</span>
                    {user.documents.drivingLicense ? (
                      <Shield className="h-5 w-5 text-success" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <Card className="p-6 border-border">
                <h3 className="font-bold text-foreground mb-4">Statistics</h3>
                <div className="space-y-3">
                  {user.role === "donor" ? (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Donations</p>
                        <p className="text-2xl font-bold text-primary">
                          {user.stats.donations}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Completed</p>
                        <p className="text-lg font-bold text-success">
                          {user.stats.completed}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Requests</p>
                        <p className="text-2xl font-bold text-primary">
                          {user.stats.requests}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Completed</p>
                        <p className="text-lg font-bold text-success">
                          {user.stats.completed}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2">
              <Tabs defaultValue="about" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4">Bio</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {user.bio}
                    </p>

                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Member since</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(user.joinedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4">Reviews</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Reviewer {i}
                              </p>
                              <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${
                                    j < 5 - i
                                      ? "text-warning fill-warning"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Great {user.role}! Very helpful and reliable. Would recommend to others.
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4">Activity History</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.role === "donor"
                        ? "View your donation history"
                        : "View your request history"}
                    </p>
                    <Button className="mt-4">
                      <Award className="mr-2 h-4 w-4" />
                      View {user.role === "donor" ? "Donations" : "Requests"}
                    </Button>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
