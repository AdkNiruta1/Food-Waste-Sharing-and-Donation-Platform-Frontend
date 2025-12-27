import { useState, useMemo } from "react";
import { Header } from "../../components/Header";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Package,
  Star,
  Search,
  Filter,
  Leaf,
} from "lucide-react";
import { mockFoodPosts } from "../../lib/mockData";

const FOOD_TYPES = [
  { value: "vegetables", label: "🥬 Vegetables" },
  { value: "fruits", label: "🍎 Fruits" },
  { value: "cooked", label: "🍲 Cooked Food" },
  { value: "dairy", label: "🥛 Dairy" },
  { value: "baked", label: "🍞 Baked" },
  { value: "other", label: "📦 Other" },
];

const DISTRICTS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kavre",
  "Nuwakot",
];

export default function BrowseFood() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    return mockFoodPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || post.type === selectedType;
      const matchesDistrict =
        !selectedDistrict || post.location.district === selectedDistrict;

      return matchesSearch && matchesType && matchesDistrict;
    });
  }, [searchQuery, selectedType, selectedDistrict]);

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 1;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Search and Filter Section */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search food donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filter Toggle and Info */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} donations
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors md:hidden"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>

            {/* Filters */}
            <div
              className={`grid md:grid-cols-2 gap-6 ${
                showFilters ? "block" : "hidden md:grid"
              }`}
            >
              {/* District Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Location (District)</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDistrict("")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedDistrict === ""
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    All
                  </button>
                  {DISTRICTS.map((district) => (
                    <button
                      key={district}
                      onClick={() => setSelectedDistrict(district)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedDistrict === district
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Type Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Food Type</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType("")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedType === ""
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    All Types
                  </button>
                  {FOOD_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedType(value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedType === value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Posts Grid */}
      <section className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No donations found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Try adjusting your filters or search terms to find food donations.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("");
                setSelectedDistrict("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/food/${post.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isExpiringSoon(post.expiryDate) && (
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        Expires Soon
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-background/90 px-3 py-1 rounded-full text-xs font-semibold text-primary">
                      {post.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Title and Donor */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-sm text-muted-foreground">
                          by {post.donorName}
                        </span>
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-xs text-muted-foreground">
                          {post.donorRating}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>

                    {/* Info Grid */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4 text-primary" />
                        {post.quantity} {post.unit}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        Expires: {new Date(post.expiryDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {post.location.city}, {post.location.district}
                      </div>
                    </div>

                    {/* Request Button */}
                    <Button
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Request Donation
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
