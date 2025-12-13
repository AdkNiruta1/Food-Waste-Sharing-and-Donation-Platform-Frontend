import { Header } from "../../components/Header";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Link } from "react-router-dom";
import {
  HandHeart,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Star,
  Leaf,
  Package,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import '../../index.css';

export default function Index() {
  const stats = [
    { label: "Food Donations", value: "1,234+" },
    { label: "Active Users", value: "892" },
    { label: "Meals Shared", value: "5,678+" },
  ];

  const features = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Easy Posting",
      description: "Donors can quickly list surplus food with details like type, quantity, and expiry date.",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Location Based",
      description: "Find food donations near you using our integrated map and location filtering.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Real-time Updates",
      description: "Track donation status from Posted to Completed with instant notifications.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Connect with donors and recipients in your community to reduce food waste.",
    },
  ];

  const steps = [
    { number: "1", title: "Sign Up", description: "Create your account as a Donor or Recipient" },
    { number: "2", title: "Post or Browse", description: "Donors post food, Recipients browse available donations" },
    { number: "3", title: "Connect", description: "Request food or accept requests with ease" },
    { number: "4", title: "Share", description: "Complete the donation and help reduce food waste" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 md:py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-transparent to-orange-500/5" />

        <div className="relative container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-[#28bd5f] rounded-full text-sm font-medium">
                  <Leaf className="h-4 w-4" />
                  Reduce Food Waste, Change Lives
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  Share Food,{" "}
                  <span className="text-[#28bd5f]">Build Community</span>
                </h1>
                <p className="text-xl text-[#727d92] 0 max-w-xl">
                  Connect surplus food with those in need. Simple, transparent, and impactful food donation platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-[#28bd5f] hover:bg-green-700">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto border-slate-300">
                    Browse Donations
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-700">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-[#28bd5f]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden md:block">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                          <Package className="h-6 w-6 text-[#28bd5f]" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Fresh Vegetables</h3>
                          <p className="text-sm text-slate-600">
                            2 km away • Expires today
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-orange-500/10">
                          <MapPin className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Smart Matching</h3>
                          <p className="text-sm text-slate-600">
                            Find donations near you
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                          <CheckCircle className="h-6 w-6 text-[#28bd5f]" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Impact Tracked</h3>
                          <p className="text-sm text-slate-600">
                            See your contribution
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How FoodShare Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A simple, transparent platform connecting food donors with those who need it most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700 group">
                <div className="p-3 rounded-lg bg-green-500/10 w-fit group-hover:bg-green-500/20 transition-colors">
                  <div className="text-[#28bd5f]">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Getting Started
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join the food sharing community in four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500/30 to-transparent" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#28bd5f] text-white font-bold text-2xl flex items-center justify-center mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500/10 to-orange-500/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Donor Card */}
            <Card className="p-8 border-2 border-green-500/30 hover:border-green-500 transition-colors group">
              <div className="p-4 rounded-lg bg-green-500/10 w-fit mb-4">
                <HandHeart className="h-8 w-8 text-[#28bd5f]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Are You a Donor?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Have surplus food? Share it with those in need. Post your donations quickly with details and location.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                  <CheckCircle className="h-4 w-4 text-[#28bd5f]" />
                  Post surplus food easily
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                  <CheckCircle className="h-4 w-4 text-[#28bd5f]" />
                  Track requests in real-time
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                  <CheckCircle className="h-4 w-4 text-[#28bd5f]" />
                  Build your impact profile
                </li>
              </ul>
              <Link to="/register">
                <Button className="w-full bg-[#28bd5f] hover:bg-green-700">Start Donating</Button>
              </Link>
            </Card>

            {/* Recipient Card */}
            <Card className="p-8 border-2 border-orange-500/30 hover:border-orange-500 transition-colors group">
              <div className="p-4 rounded-lg bg-orange-500/10 w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Looking for Food?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Browse available food donations near you. Filter by location, type, and availability.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                  <CheckCircle className="h-4 w-4 text-[#28bd5f]" />
                  Browse nearby donations
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                  <CheckCircle className="h-4 w-4 text-[#28bd5f]" />
                  Request with one click
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                  <CheckCircle className="h-4 w-4 text-[#28bd5f]" />
                  Track request status
                </li>
              </ul>
              <Link to="/browse">
                <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-500/10">
                  Browse Food
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg text-[#28bd5f] mb-4">
                <Leaf className="h-5 w-5" />
                <span>FoodShare</span>
              </div>
              <p className="text-sm text-slate-600">
                Reducing food waste, one donation at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/browse" className="hover:text-[#28bd5f] transition-colors">Browse</Link></li>
                <li><Link to="/donate" className="hover:text-[#28bd5f] transition-colors">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">About</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#28bd5f] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#28bd5f] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#28bd5f] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#28bd5f] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-600">
              © 2025 FoodShare. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Star className="h-5 w-5 text-slate-500 hover:text-[#28bd5f] cursor-pointer transition-colors" />
              <Users className="h-5 w-5 text-slate-500 hover:text-[#28bd5f] cursor-pointer transition-colors" />
              <TrendingUp className="h-5 w-5 text-slate-500 hover:text-[#28bd5f] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}