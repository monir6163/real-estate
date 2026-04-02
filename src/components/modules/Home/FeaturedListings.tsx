"use client";
import { getFeaturedProperties } from "@/actions/properties";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/demo-data";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FeaturedListings = () => {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const result = await getFeaturedProperties({ limit: 10 });

        if (result.success) {
          // Convert API response to frontend Property type
          const typeMap: Record<string, string> = {
            APARTMENT: "Apartment",
            HOUSE: "House",
            COMMERCIAL: "Commercial",
            LAND: "Land",
          };

          const convertedProperties: Property[] = result.data.map(
            (prop: any) => {
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
                status: prop.listingType === "RENT" ? "For Rent" : "For Sale",
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
            },
          );

          setFeatured(convertedProperties);
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const SkeletonCard = () => (
    <div className="shrink-0 w-80 sm:w-96 snap-start">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Image skeleton */}
        <div className="relative overflow-hidden aspect-4/3 w-full bg-muted animate-pulse" />

        {/* Content skeleton */}
        <div className="p-4 flex flex-col flex-1">
          {/* Location line */}
          <div className="mb-1">
            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          </div>

          {/* Title lines */}
          <div className="mb-3 space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>

          {/* Features line */}
          <div className="mb-3 space-y-2">
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            <div className="h-3 w-3/5 bg-muted rounded animate-pulse" />
          </div>

          {/* Price line */}
          <div className="pt-3 border-t border-border mt-auto">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">
              Featured
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Top Properties
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {loading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))}
            </>
          ) : featured.length > 0 ? (
            featured.map((property: any) => (
              <div
                key={property.id}
                className="shrink-0 w-80 sm:w-96 snap-start"
              >
                <PropertyCard property={property} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full min-h-80 col-span-full">
              <p className="text-muted-foreground">
                No featured properties available
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link href="/properties">
              View All Properties <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
