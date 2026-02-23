import { Header } from "../../components/Header";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react"; // Added for radio state
import {
  Leaf,
  Heart,
  Users,
  TrendingUp,
  CheckCircle,
  Globe,
  ArrowRight,
} from "lucide-react";
import Mission from "../../assets/mission.png"
// Custom Package icon
const PackageIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m4-4v4"
    />
  </svg>
);

export default function About() {
  const [selectedRole, setSelectedRole] = useState("donor"); // Default: donor

  const teamMembers = [
    {
      name: "Niruta Adhikari",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Passionate about food sustainability and community impact",
    },
  ];

  const stats = [
    { number: "1,234+", label: "Food Donations", icon: <PackageIcon /> },
    { number: "892", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "5,678+", label: "Meals Shared", icon: <Heart className="h-6 w-6" /> },
    { number: "48", label: "Districts Covered", icon: <Globe className="h-6 w-6" /> },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Donors Post Surplus Food",
      description: "Food businesses and individuals share their surplus food with details like quantity, type, and pickup instructions.",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
    {
      step: 2,
      title: "Recipients Find Donations",
      description: "People in need browse available food donations near them with smart matching based on location and preferences.",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
    {
      step: 3,
      title: "Easy Connection & Pickup",
      description: "Direct messaging, real-time tracking, and verified user profiles ensure safe and reliable food sharing.",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
    {
      step: 4,
      title: "Build Community Trust",
      description: "Ratings and reviews help build a trusted community where both givers and receivers have confidence.",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              About Annapurna Bhandar
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            We're on a mission to eliminate food waste and build communities where food is shared, not wasted. Every meal counts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mission Section */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-4">
                Annapurna Bhandar is building the world's most trusted food sharing platform to connect surplus food with those in need.
              </p>
              <p className="text-lg text-slate-600 mb-6">
                We believe that no food should go to waste while people go hungry. Through technology, community, and trust, we're creating a world where food is valued and shared equitably.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                  <span className="text-slate-900">Reduce food waste by up to 40%</span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                  <span className="text-slate-900">Feed thousands of families monthly</span>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                  <span className="text-slate-900">Build sustainable communities</span>
                </div>
              </div>
            </div>
            <div className=" rounded-lg p-8 h-96 flex items-center justify-center">
              <img className=" object-cover object-center" src={Mission} />
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center border-slate-200">
                  <div className="text-green-600 mb-3 flex justify-center">{stat.icon}</div>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            How Annapurna Bhandar Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {howItWorks.map((item) => (
              <Card key={item.step} className="p-8 border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.step}. {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 text-center border-slate-200 hover:shadow-lg transition-shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-green-100"
                  />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-slate-600">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-slate-200">
              <Leaf className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sustainability</h3>
              <p className="text-slate-600">
                We're committed to reducing food waste and environmental impact through smart food sharing.
              </p>
            </Card>
            <Card className="p-8 border-slate-200">
              <Users className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
              <p className="text-slate-600">
                Building strong communities where people care for each other and support those in need.
              </p>
            </Card>
            <Card className="p-8 border-slate-200">
              <Heart className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Compassion</h3>
              <p className="text-slate-600">
                Every action is driven by empathy and a genuine desire to make a positive difference.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section with Radio Selection */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Community Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Whether you want to share surplus food or find support, Annapurna Bhandar is here to help you make a difference.
            </p>

            {/* Radio Button Role Selector */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur rounded-full p-1 mb-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="donor"
                  checked={selectedRole === "donor"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="sr-only"
                />
                <span
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedRole === "donor"
                      ? "bg-white text-green-700 shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  I'm a Donor
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recipient"
                  checked={selectedRole === "recipient"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="sr-only"
                />
                <span
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedRole === "recipient"
                      ? "bg-white text-green-700 shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  I Need Food
                </span>
              </label>
            </div>

            {/* Dynamic CTA Button */}
            <Link to={`/register?role=${selectedRole}`}>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                {selectedRole === "donor" ? "Become a Donor" : "Find Food Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}