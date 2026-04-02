"use client";
import { Property } from "@/lib/demo-data";
import { Bath, BedDouble, Heart, MapPin, Maximize, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
  layout?: "grid" | "list";
}

const PropertyCard = ({ property, layout = "grid" }: PropertyCardProps) => {
  const [saved, setSaved] = useState(false);
  const reviewCount = property.reviewCount || 0;
  const averageRating = property.averageRating || 0;

  const formatPrice = (price: number, status: string) => {
    if (status === "For Rent") return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  if (layout === "list") {
    return (
      <Link
        href={`/properties/${property.id}`}
        className="group flex flex-col sm:flex-row bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        <div className="relative w-full sm:w-72 h-48 sm:h-auto shrink-0">
          <img
            src={property.image}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-md">
            {property.status}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved(!saved);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
              saved
                ? "bg-destructive/90 text-destructive-foreground"
                : "bg-background/70 text-foreground hover:bg-background"
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {property.location}
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
              {property.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {property.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                {property.beds > 0 && (
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" /> {property.beds}
                  </span>
                )}
                {property.baths > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {property.baths}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Maximize className="w-4 h-4" />{" "}
                  {property.sqft.toLocaleString()} sqft
                </span>
              </div>
              {reviewCount > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">({reviewCount})</span>
                </div>
              )}
            </div>
            <p className="font-display font-bold text-lg text-primary">
              {formatPrice(property.price, property.status)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative overflow-hidden aspect-4/3 w-full bg-muted">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-md">
          {property.status}
        </span>
        <span className="absolute top-3 left-20 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-md">
          {property.type}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved(!saved);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            saved
              ? "bg-destructive/90 text-destructive-foreground"
              : "bg-background/70 text-foreground hover:bg-background"
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
          <MapPin className="w-3.5 h-3.5" />
          {property.location}
        </div>
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
          {property.title}
        </h3>
        <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3 flex-wrap">
          {property.beds > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" /> {property.beds} Beds
            </span>
          )}
          {property.baths > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {property.baths} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5" />{" "}
            {property.sqft.toLocaleString()}
          </span>
        </div>
        {reviewCount > 0 && (
          <div className="mb-3 flex items-center gap-1.5 text-amber-500 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-xs">
              ({reviewCount} reviews)
            </span>
          </div>
        )}
        <div className="pt-3 border-t border-border mt-auto">
          <p className="font-display font-bold text-lg text-primary">
            {formatPrice(property.price, property.status)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
