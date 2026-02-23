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
import { useEffect } from "react";
import { useGetFood } from "../recipient/browser/hooks/useGetFood";
import { IMAGE_URL } from "../../constants/constants";

const FOOD_TYPES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "cooked", label: "Cooked Food" },
  { value: "dairy", label: "Dairy" },
  { value: "baked", label: "Baked Goods" },
  { value: "other", label: "Other" },
];

const DISTRICTS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kavre",
  "Nuwakot",
  "Sunsari",
  "Kaski",
  "Morang",
  "Illam"
];

export default function BrowseFood() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { foods, pagination, loading, fetchFoodDonation } = useGetFood();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFoodDonation(page, 9);
  }, [page]);

  const filteredPosts = useMemo(() => {
    return foods.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !selectedType || post.type === selectedType;
      const matchesDistrict = !selectedDistrict || post.district === selectedDistrict;

      return matchesSearch && matchesType && matchesDistrict;
    });
  }, [foods, searchQuery, selectedType, selectedDistrict]);


  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date("2026-01-03"); // Current date: January 03, 2026
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 1;
  };
  { loading && <p className="text-center">Loading food...</p> }

  {
    !loading && filteredPosts.length === 0 && (
      <p className="text-center">No food donations found</p>
    )
  }


  return (

    <div className="min-h-screen flex flex-col bg-white">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
          <Leaf className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Find Available Food Donations
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Browse surplus food shared by generous donors in your area. Request what you need — it's free and simple.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500" />
              <Input
                type="text"
                placeholder="Search by food name, description, or donor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 text-lg"
              />
            </div>

            {/* Filter Toggle & Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-slate-600">
                Showing <strong>{filteredPosts.length}</strong> donation{filteredPosts.length !== 1 ? "s" : ""}
              </p>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium md:hidden"
              >
                <Filter className="h-5 w-5" />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>

            {/* Filters */}
            <div className={`space-y-8 ${showFilters ? "block" : "hidden md:block"}`}>
              {/* District Filter */}
              <div>
                <Label className="text-base font-semibold text-slate-900 mb-4 block">
                  Location (District)
                </Label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedDistrict("")}
                    className={`px-6 py-3 rounded-full font-medium transition-all ${selectedDistrict === ""
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    All Districts
                  </button>
                  {DISTRICTS.map((district) => (
                    <button
                      key={district}
                      onClick={() => setSelectedDistrict(district)}
                      className={`px-6 py-3 rounded-full font-medium transition-all ${selectedDistrict === district
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Type Filter */}
              <div>
                <Label className="text-base font-semibold text-slate-900 mb-4 block">
                  Food Type
                </Label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedType("")}
                    className={`px-6 py-3 rounded-full font-medium transition-all ${selectedType === ""
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    All Types
                  </button>
                  {FOOD_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedType(value)}
                      className={`px-6 py-3 rounded-full font-medium transition-all ${selectedType === value
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-100"
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

      {/* Food Listings */}
      <section className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-20 w-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              No food donations found
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Try adjusting your search or filters. New donations are posted regularly!
            </p>
            <Button
              size="lg"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("");
                setSelectedDistrict("");
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/login`} className="block">
                <Card className="h-full overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={IMAGE_URL + post.photo || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {isExpiringSoon(post.expiryDate) && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        Expires Soon!
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Available
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-5">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-slate-600">by</span>
                        <span className="font-semibold text-slate-900">
                          {post.donor.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{post.donorRating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-slate-900">
                          {post.quantity} {post.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-slate-900">
                          Best before: {new Date(post.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-slate-900">
                          {post.city}, {post.district}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                      Request This Food
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {pagination && (
          <div className="flex justify-center gap-4 mt-12">
            <Button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="px-4 py-2 font-semibold">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}

      </section>
    </div>
  );
}