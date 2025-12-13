// import { Header } from "../../components/Header";
// import { Card } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Link } from "react-router-dom";
// import {
//   Leaf,
//   Heart,
//   Users,
//   TrendingUp,
//   CheckCircle,
//   Globe,
//   ArrowRight,
// } from "lucide-react";

// export default function About() {
//   const teamMembers = [
//     {
//       name: "Sarah Chen",
//       role: "Founder & CEO",
//       image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
//       bio: "Passionate about food sustainability and community impact",
//     },
//     {
//       name: "Raj Kumar",
//       role: "Head of Operations",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
//       bio: "Manages logistics and community partnerships",
//     },
//     {
//       name: "Priya Patel",
//       role: "Community Manager",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
//       bio: "Builds relationships with donors and recipients",
//     },
//     {
//       name: "Alex Johnson",
//       role: "Tech Lead",
//       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
//       bio: "Develops the platform and ensures reliability",
//     },
//   ];

//   const stats = [
//     { number: "1,234+", label: "Food Donations", icon: <Package className="h-6 w-6" /> },
//     { number: "892", label: "Active Users", icon: <Users className="h-6 w-6" /> },
//     { number: "5,678+", label: "Meals Shared", icon: <Heart className="h-6 w-6" /> },
//     { number: "48", label: "Districts Covered", icon: <Globe className="h-6 w-6" /> },
//   ];

//   const howItWorks = [
//     {
//       step: 1,
//       title: "Donors Post Surplus Food",
//       description: "Food businesses and individuals share their surplus food with details like quantity, type, and pickup instructions.",
//       icon: <CheckCircle className="h-8 w-8 text-primary" />,
//     },
//     {
//       step: 2,
//       title: "Recipients Find Donations",
//       description: "People in need browse available food donations near them with smart matching based on location and preferences.",
//       icon: <CheckCircle className="h-8 w-8 text-primary" />,
//     },
//     {
//       step: 3,
//       title: "Easy Connection & Pickup",
//       description: "Direct messaging, real-time tracking, and verified user profiles ensure safe and reliable food sharing.",
//       icon: <CheckCircle className="h-8 w-8 text-primary" />,
//     },
//     {
//       step: 4,
//       title: "Build Community Trust",
//       description: "Ratings and reviews help build a trusted community where both givers and receivers have confidence.",
//       icon: <CheckCircle className="h-8 w-8 text-primary" />,
//     },
//   ];

//   const Package = () => (
//     <svg
//       className="h-6 w-6"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m4-4v4"
//       />
//     </svg>
//   );

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Header />

//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
//         <div className="container mx-auto max-w-6xl px-4 py-16">
//           <div className="flex items-center gap-3 mb-6">
//             <Leaf className="h-8 w-8 text-primary" />
//             <h1 className="text-4xl font-bold text-foreground">About FoodShare</h1>
//           </div>
//           <p className="text-lg text-muted-foreground max-w-2xl">
//             We're on a mission to eliminate food waste and build communities where food is shared, not wasted. Every meal counts.
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         {/* Mission Section */}
//         <section className="container mx-auto max-w-6xl px-4 py-16">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
//               <p className="text-lg text-muted-foreground mb-4">
//                 FoodShare is building the world's most trusted food sharing platform to connect surplus food with those in need.
//               </p>
//               <p className="text-lg text-muted-foreground mb-6">
//                 We believe that no food should go to waste while people go hungry. Through technology, community, and trust, we're creating a world where food is valued and shared equitably.
//               </p>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
//                   <span className="text-foreground">Reduce food waste by up to 40%</span>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
//                   <span className="text-foreground">Feed thousands of families monthly</span>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
//                   <span className="text-foreground">Build sustainable communities</span>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-8 h-96 flex items-center justify-center">
//               <Leaf className="h-32 w-32 text-primary/20" />
//             </div>
//           </div>
//         </section>

//         {/* Impact Stats */}
//         <section className="bg-card border-y border-border py-16">
//           <div className="container mx-auto max-w-6xl px-4">
//             <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
//               Our Impact
//             </h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               {stats.map((stat, index) => (
//                 <Card key={index} className="p-6 text-center border-border">
//                   <div className="text-primary mb-3 flex justify-center">{stat.icon}</div>
//                   <p className="text-3xl font-bold text-foreground mb-2">
//                     {stat.number}
//                   </p>
//                   <p className="text-sm text-muted-foreground">{stat.label}</p>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* How It Works */}
//         <section className="container mx-auto max-w-6xl px-4 py-16">
//           <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
//             How FoodShare Works
//           </h2>
//           <div className="grid md:grid-cols-2 gap-8">
//             {howItWorks.map((item) => (
//               <Card key={item.step} className="p-8 border-border hover:shadow-lg transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <div className="flex-shrink-0">{item.icon}</div>
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-foreground mb-2">
//                       {item.step}. {item.title}
//                     </h3>
//                     <p className="text-muted-foreground">{item.description}</p>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Team Section */}
//         <section className="bg-card border-y border-border py-16">
//           <div className="container mx-auto max-w-6xl px-4">
//             <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
//               Meet Our Team
//             </h2>
//             <div className="grid md:grid-cols-4 gap-8">
//               {teamMembers.map((member, index) => (
//                 <Card key={index} className="p-6 text-center border-border hover:shadow-lg transition-shadow">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
//                   />
//                   <h3 className="text-lg font-bold text-foreground mb-1">
//                     {member.name}
//                   </h3>
//                   <p className="text-sm text-primary font-medium mb-3">
//                     {member.role}
//                   </p>
//                   <p className="text-sm text-muted-foreground">{member.bio}</p>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Values Section */}
//         <section className="container mx-auto max-w-6xl px-4 py-16">
//           <h2 className="text-3xl font-bold text-foreground mb-12">Our Values</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="p-8 border-border">
//               <Leaf className="h-8 w-8 text-primary mb-4" />
//               <h3 className="text-xl font-bold text-foreground mb-3">Sustainability</h3>
//               <p className="text-muted-foreground">
//                 We're committed to reducing food waste and environmental impact through smart food sharing.
//               </p>
//             </Card>
//             <Card className="p-8 border-border">
//               <Users className="h-8 w-8 text-primary mb-4" />
//               <h3 className="text-xl font-bold text-foreground mb-3">Community</h3>
//               <p className="text-muted-foreground">
//                 Building strong communities where people care for each other and support those in need.
//               </p>
//             </Card>
//             <Card className="p-8 border-border">
//               <Heart className="h-8 w-8 text-primary mb-4" />
//               <h3 className="text-xl font-bold text-foreground mb-3">Compassion</h3>
//               <p className="text-muted-foreground">
//                 Every action is driven by empathy and a genuine desire to make a positive difference.
//               </p>
//             </Card>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
//           <div className="container mx-auto max-w-4xl px-4 text-center">
//             <h2 className="text-3xl font-bold text-white mb-4">
//               Join Our Community Today
//             </h2>
//             <p className="text-lg text-white/90 mb-8">
//               Whether you want to share surplus food or find support, FoodShare is here to help you make a difference.
//             </p>
//             <div className="flex flex-col md:flex-row gap-4 justify-center">
//               <Link to="/register?role=donor">
//                 <Button size="lg" variant="secondary">
//                   Become a Donor
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Link to="/register?role=recipient">
//                 <Button size="lg" className="bg-white text-primary hover:bg-white/90">
//                   Find Food
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
