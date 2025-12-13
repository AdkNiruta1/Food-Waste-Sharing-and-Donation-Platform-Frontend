// import { Header } from "../../components/Header";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Card } from "../../components/ui/card";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
// import { Leaf, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
// import { useState } from "react";
// import { Alert, AlertDescription } from "../../components/ui/alert";

// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//     subscribe: true,
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const contactInfo = [
//     {
//       icon: <Mail className="h-6 w-6" />,
//       title: "Email",
//       details: "support@foodshare.com",
//       description: "We respond within 24 hours",
//     },
//     {
//       icon: <Phone className="h-6 w-6" />,
//       title: "Phone",
//       details: "+977 1 4123456",
//       description: "Monday to Friday, 9 AM - 5 PM",
//     },
//     {
//       icon: <MapPin className="h-6 w-6" />,
//       title: "Address",
//       details: "Kathmandu, Nepal",
//       description: "Tech Park, Thamel",
//     },
//     {
//       icon: <Clock className="h-6 w-6" />,
//       title: "Office Hours",
//       details: "Mon - Fri: 9 AM - 5 PM",
//       description: "Sat: 10 AM - 3 PM (Closed Sun)",
//     },
//   ];

//   const handleInputChange = (
//     e
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }
//     if (!formData.email.trim() || !formData.email.includes("@")) {
//       newErrors.email = "Valid email is required";
//     }
//     if (!formData.subject.trim()) {
//       newErrors.subject = "Subject is required";
//     }
//     if (!formData.message.trim() || formData.message.length < 10) {
//       newErrors.message = "Message must be at least 10 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     // Simulate sending message
//     setTimeout(() => {
//       setLoading(false);
//       setSubmitted(true);
//       setFormData({ name: "", email: "", subject: "", message: "" });

//       // Reset success message after 5 seconds
//       setTimeout(() => setSubmitted(false), 5000);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Header />

//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
//         <div className="container mx-auto max-w-6xl px-4 py-16">
//           <div className="flex items-center gap-3 mb-6">
//             <Mail className="h-8 w-8 text-primary" />
//             <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
//           </div>
//           <p className="text-lg text-muted-foreground max-w-2xl">
//             Have questions or feedback? We'd love to hear from you. Get in touch with our team.
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         <div className="container mx-auto max-w-6xl px-4 py-16">
//           <div className="grid md:grid-cols-3 gap-12">
//             {/* Contact Information */}
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-foreground mb-8">Get in Touch</h2>

//               {contactInfo.map((info, index) => (
//                 <Card key={index} className="p-6 border-border hover:shadow-lg transition-shadow">
//                   <div className="flex items-start gap-4">
//                     <div className="text-primary mt-1 shrink-0">{info.icon}</div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-foreground mb-1">
//                         {info.title}
//                       </h3>
//                       <p className="font-medium text-foreground">{info.details}</p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {info.description}
//                       </p>
//                     </div>
//                   </div>
//                 </Card>
//               ))}

//               {/* Social Links */}
//               <Card className="p-6 border-border bg-accent/5">
//                 <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
//                 <div className="flex gap-3">
//                   <a
//                     href="#facebook"
//                     className="w-10 h-10 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors"
//                   >
//                     f
//                   </a>
//                   <a
//                     href="#twitter"
//                     className="w-10 h-10 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors"
//                   >
//                     𝕏
//                   </a>
//                   <a
//                     href="#linkedin"
//                     className="w-10 h-10 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors"
//                   >
//                     in
//                   </a>
//                   <a
//                     href="#instagram"
//                     className="w-10 h-10 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors"
//                   >
//                     📷
//                   </a>
//                 </div>
//               </Card>
//             </div>

//             {/* Contact Form */}
//             <div className="md:col-span-2">
//               <Card className="p-8 border-border">
//                 {submitted && (
//                   <Alert className="mb-6 border-success bg-success/10">
//                     <CheckCircle className="h-4 w-4 text-success" />
//                     <AlertDescription className="text-success">
//                       Thank you for your message! We'll get back to you soon.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {Object.keys(errors).length > 0 && (
//                   <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>
//                       Please fix the errors below
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="name" className="text-sm font-medium">
//                         Full Name *
//                       </Label>
//                       <Input
//                         id="name"
//                         name="name"
//                         type="text"
//                         placeholder="John Doe"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="h-10"
//                       />
//                       {errors.name && (
//                         <p className="text-xs text-destructive">{errors.name}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email" className="text-sm font-medium">
//                         Email Address *
//                       </Label>
//                       <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         placeholder="you@example.com"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="h-10"
//                       />
//                       {errors.email && (
//                         <p className="text-xs text-destructive">{errors.email}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="subject" className="text-sm font-medium">
//                       Subject *
//                     </Label>
//                     <Input
//                       id="subject"
//                       name="subject"
//                       type="text"
//                       placeholder="What is this about?"
//                       value={formData.subject}
//                       onChange={handleInputChange}
//                       className="h-10"
//                     />
//                     {errors.subject && (
//                       <p className="text-xs text-destructive">{errors.subject}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="message" className="text-sm font-medium">
//                       Message *
//                     </Label>
//                     <Textarea
//                       id="message"
//                       name="message"
//                       placeholder="Tell us what's on your mind..."
//                       value={formData.message}
//                       onChange={handleInputChange}
//                       rows={6}
//                       className="resize-none"
//                     />
//                     <div className="flex justify-between">
//                       <p className="text-xs text-muted-foreground">
//                         Minimum 10 characters
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {formData.message.length}/2000
//                       </p>
//                     </div>
//                     {errors.message && (
//                       <p className="text-xs text-destructive">{errors.message}</p>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 p-4 bg-accent/5 rounded-lg border border-accent">
//                     <input
//                       type="checkbox"
//                       id="subscribe"
//                       className="w-4 h-4"
//                       defaultChecked
//                     />
//                     <label
//                       htmlFor="subscribe"
//                       className="text-sm text-muted-foreground cursor-pointer"
//                     >
//                       I'd like to receive updates and news from FoodShare
//                     </label>
//                   </div>

//                   <Button type="submit" className="w-full" disabled={loading}>
//                     {loading ? "Sending..." : "Send Message"}
//                   </Button>
//                 </form>

//                 <div className="mt-8 pt-8 border-t border-border">
//                   <h3 className="font-semibold text-foreground mb-4">
//                     Response Time
//                   </h3>
//                   <p className="text-sm text-muted-foreground">
//                     We typically respond to inquiries within 24 hours during business hours. For urgent matters, please call us directly.
//                   </p>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>

//         {/* FAQs Section */}
//         <section className="bg-card border-y border-border py-16">
//           <div className="container mx-auto max-w-6xl px-4">
//             <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
//               Frequently Asked Questions
//             </h2>
//             <div className="grid md:grid-cols-2 gap-8">
//               {[
//                 {
//                   q: "How do I donate food?",
//                   a: "Sign up as a donor, post your surplus food with details, and recipients will reach out to request it.",
//                 },
//                 {
//                   q: "Is it safe to share food?",
//                   a: "Yes! We verify all users, allow ratings and reviews, and provide in-app messaging for direct communication.",
//                 },
//                 {
//                   q: "What food can be donated?",
//                   a: "Fresh vegetables, fruits, cooked meals, dairy, baked goods, and packaged items. Must be safe and well-preserved.",
//                 },
//                 {
//                   q: "How does pickup work?",
//                   a: "Donors and recipients agree on a time and location. We provide in-app messaging and tracking for coordination.",
//                 },
//                 {
//                   q: "Can I request from multiple donations?",
//                   a: "Yes, you can request from any available donation. Each request is independent and tracked separately.",
//                 },
//                 {
//                   q: "How is quality ensured?",
//                   a: "Through user ratings, reviews, and community feedback. Verified profiles and transparent communication are key.",
//                 },
//               ].map((faq, index) => (
//                 <Card key={index} className="p-6 border-border">
//                   <h3 className="font-semibold text-foreground mb-3">{faq.q}</h3>
//                   <p className="text-sm text-muted-foreground">{faq.a}</p>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
