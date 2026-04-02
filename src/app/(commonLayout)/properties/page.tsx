"use client";

import { getAllProperties } from "@/actions/properties";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/lib/demo-data";
import { getErrorMessage } from "@/lib/error-message";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PropertyFilters {
  search: string;
  minPrice: number | "";
  maxPrice: number | "";
  bedrooms: number | "";
  bathrooms: number | "";
  location: string;
  type?: string;
  listingType?: string;
  sortOrder?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [appliedFilters, setAppliedFilters] = useState<PropertyFilters>({
    search: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
    type: "",
    listingType: "",
    sortOrder: "desc",
  });

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page: currentPage,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: appliedFilters.sortOrder || "desc",
      };

      if (appliedFilters.search.trim()) {
        filters.search = appliedFilters.search.trim();
      }
      if (appliedFilters.minPrice !== "") {
        filters.minPrice = appliedFilters.minPrice;
      }
      if (appliedFilters.maxPrice !== "") {
        filters.maxPrice = appliedFilters.maxPrice;
      }
      if (appliedFilters.bedrooms !== "") {
        filters.bedrooms = appliedFilters.bedrooms;
      }
      if (appliedFilters.bathrooms !== "") {
        filters.bathrooms = appliedFilters.bathrooms;
      }
      if (appliedFilters.location.trim()) {
        filters.location = appliedFilters.location.trim();
      }
      if (appliedFilters.type) {
        filters.type = appliedFilters.type;
      }
      if (appliedFilters.listingType) {
        filters.listingType = appliedFilters.listingType;
      }

      const result = await getAllProperties(filters);

      if (result.success) {
        // Convert API response to frontend Property type for PropertyCard
        const convertedProperties: Property[] = result.data.map((prop: any) => {
          // Map property type: APARTMENT -> Apartment, etc.
          const typeMap: Record<string, string> = {
            APARTMENT: "Apartment",
            HOUSE: "House",
            COMMERCIAL: "Commercial",
            LAND: "Land",
          };

          // Map status: AVAILABLE -> Available, determine listing type from listingType
          const statusDisplay =
            prop.listingType === "RENT" ? "For Rent" : "For Sale";

          const reviewCount = prop.reviews?.length || 0;
          const averageRating =
            reviewCount > 0
              ? prop.reviews.reduce(
                  (sum: number, review: { rating: number }) =>
                    sum + review.rating,
                  0,
                ) / reviewCount
              : 0;

          return {
            id: prop.id,
            title: prop.title,
            location: prop.location,
            price: prop.price,
            type: typeMap[prop.type] || prop.type,
            status: statusDisplay,
            beds: prop.bedrooms,
            baths: prop.bathrooms,
            sqft: prop.area,
            image: prop.thumbnail,
            images: prop.propertyImages?.map((img: any) => img.url) || [
              prop.thumbnail,
            ],
            description: prop.description,
            features: [],
            agent: {
              name: prop.agent?.name || "Agent",
              phone: "",
              image: prop.agent?.image || "",
            },
            featured: prop.isFeatured,
            yearBuilt: new Date(prop.createdAt).getFullYear(),
            garage: 0,
            reviewCount,
            averageRating,
          };
        });

        setProperties(convertedProperties);
        setTotalPages(result.meta.totalPages);
        setTotalProperties(result.meta.total);
      } else {
        setError(result.error || "Could not load properties right now.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Could not load properties right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, appliedFilters]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedFilters({
      search: searchQuery,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      location,
      type: propertyType,
      listingType,
      sortOrder,
    });
    setCurrentPage(1); // Reset to first page on apply
  };

  const handleReset = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setLocation("");
    setPropertyType("");
    setListingType("");
    setSortOrder("desc");
    setAppliedFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
      type: "",
      listingType: "",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  // Check if any filters are applied
  const hasActiveFilters =
    appliedFilters.search !== "" ||
    appliedFilters.minPrice !== "" ||
    appliedFilters.maxPrice !== "" ||
    appliedFilters.bedrooms !== "" ||
    appliedFilters.bathrooms !== "" ||
    appliedFilters.location !== "" ||
    appliedFilters.type !== "" ||
    appliedFilters.listingType !== "" ||
    appliedFilters.sortOrder !== "desc";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Properties
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse our extensive collection of properties
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Search & Filter
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Search Properties
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, description, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Searches in property titles, descriptions, and locations
              </p>
            </div>

            {/* Price & Bedrooms Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="$"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? parseInt(e.target.value) : "")
                  }
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="$"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? parseInt(e.target.value) : "")
                  }
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={bedrooms}
                  onChange={(e) =>
                    setBedrooms(e.target.value ? parseInt(e.target.value) : "")
                  }
                  min="0"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={bathrooms}
                  onChange={(e) =>
                    setBathrooms(e.target.value ? parseInt(e.target.value) : "")
                  }
                  min="0"
                  className="h-10"
                />
              </div>
            </div>

            {/* Location & Type Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="City, region, or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APARTMENT">Apartment</SelectItem>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="LAND">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Listing Type
                </label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Listings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RENT">For Rent</SelectItem>
                    <SelectItem value="SALE">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Sort Order
                </label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Descending" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1 h-10 font-medium"
              >
                Search Properties
              </Button>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2 h-10"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    Found{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {totalProperties}
                    </span>{" "}
                    {totalProperties === 1 ? "property" : "properties"}
                    {hasActiveFilters && (
                      <span className="text-blue-600 dark:text-blue-400 ml-2">
                        (filtered)
                      </span>
                    )}
                  </>
                )}
              </p>
              {!loading && hasActiveFilters && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Showing {properties.length} of {totalProperties} results
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-red-100 dark:bg-red-900/40">
                  <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  Error loading properties
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-full h-48 bg-slate-300 dark:bg-slate-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded animate-pulse w-1/2" />
                    <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                layout="grid"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center mb-12 border border-slate-200 dark:border-slate-700">
            <div className="flex w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "No properties available at the moment."}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mb-12">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="h-10"
              >
                ← Previous
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  const pageNum = Math.max(1, currentPage - 2) + idx;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="h-10 w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                className="h-10"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
