"use client";

import { getAllProperties, togglePropertyFeatured } from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error-message";
import {
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  thumbnail?: string;
  isFeatured?: boolean;
}

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getAllProperties();

        if (result.success) {
          let props: Property[] = [];
          if (result.data) {
            props = Array.isArray(result.data) ? result.data : [];
          }
          setProperties(props);
          setFilteredProperties(props);
        } else {
          setError(result.error || "Could not load properties right now.");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Could not load properties right now."));
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = properties.filter(
      (prop) =>
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

  const handleToggleFeatured = async (propertyId: string) => {
    try {
      setTogglingId(propertyId);
      const result = await togglePropertyFeatured(propertyId);

      if (result.success) {
        // Update local state
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId ? { ...p, isFeatured: !p.isFeatured } : p,
          ),
        );
        toast.success(result.message || "Featured status updated");
      } else {
        toast.error(
          result.message ||
            "Could not update featured status. Please try again.",
        );
      }
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Could not update featured status. Please try again.",
        ),
      );
    } finally {
      setTogglingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "RENTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin-dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            All Properties
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all properties in the system
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Search */}
        <Card className="p-4 mb-6 bg-white dark:bg-slate-800">
          <Input
            type="text"
            placeholder="Search properties by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
          />
        </Card>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm
                ? "Try adjusting your search"
                : "No properties available"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-slate-800"
              >
                {/* Property Image */}
                {property.thumbnail ? (
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <img
                      src={property.thumbnail}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {property.location}
                      </p>
                    </div>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>

                  {/* Price & Details */}
                  <div className="space-y-2 mb-4">
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      ${property.price.toLocaleString()}
                    </p>
                    {(property.bedrooms || property.bathrooms) && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {property.bedrooms && `${property.bedrooms} bed`}
                        {property.bathrooms && ` • ${property.bathrooms} bath`}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Link href={`/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button
                      variant={property.isFeatured ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFeatured(property.id)}
                      disabled={togglingId === property.id}
                      className={
                        property.isFeatured
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : ""
                      }
                      title={
                        property.isFeatured
                          ? "Remove from featured"
                          : "Add to featured"
                      }
                    >
                      {togglingId === property.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star
                          className={`w-4 h-4 ${property.isFeatured ? "fill-current" : ""}`}
                        />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Total Count */}
        {!loading && (
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            <p>
              Showing {filteredProperties.length} of {properties.length}{" "}
              properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
