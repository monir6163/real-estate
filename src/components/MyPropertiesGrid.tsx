"use client";

import { deleteProperty } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error-message";
import { EditIcon, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface PropertyImage {
  id: string;
  url: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  listingType: string;
  status: string;
  thumbnail: string;
  isFeatured: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  propertyImages?: PropertyImage[];
}

interface MyPropertiesGridProps {
  properties: Property[];
}

export default function MyPropertiesGrid({
  properties,
}: MyPropertiesGridProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    setDeletingId(propertyId);
    startTransition(async () => {
      try {
        const result = await deleteProperty(propertyId);

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success(result.message);
        // Reload the page to refresh the list
        window.location.reload();
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error(
          getErrorMessage(
            error,
            "Could not delete property. Please try again.",
          ),
        );
        setDeletingId(null);
      }
    });
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No properties yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Start by creating your first property listing
          </p>
          <Link href="/agent-dashboard/create-property">
            <Button>Create Property</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Property Image */}
            <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-700">
              {property.thumbnail ? (
                <Image
                  src={property.thumbnail}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No image
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    property.status === "AVAILABLE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">
                {property.title}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {property.location}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  ${property.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {property.listingType === "RENT" ? "/ month" : ""}
                </span>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-slate-100 dark:bg-slate-700 rounded">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {property.bedrooms}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Bedrooms
                  </p>
                </div>
                <div className="text-center p-2 bg-slate-100 dark:bg-slate-700 rounded">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {property.bathrooms}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Bathrooms
                  </p>
                </div>
                <div className="text-center p-2 bg-slate-100 dark:bg-slate-700 rounded">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {property.area}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    sqft
                  </p>
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {property.description}
              </p>

              {/* Type & Listing Info */}
              <div className="flex gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                  {property.type}
                </span>
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">
                  {property.listingType}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link href={`/properties/${property.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link
                  href={`/agent-dashboard/edit-property/${property.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <EditIcon className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(property.id)}
                  disabled={deletingId === property.id || isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deletingId === property.id && isPending
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
