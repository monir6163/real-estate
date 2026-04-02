"use client";

import { getPropertyById } from "@/actions/properties";
import BookPropertyModal from "@/components/BookPropertyModal";
import ReviewForm from "@/components/ReviewForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import {
  Bath,
  BedDouble,
  Heart,
  Mail,
  MapPin,
  Maximize,
  Phone,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PropertyData {
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
  agent?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };
  propertyImages?: Array<{
    id: string;
    url: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt?: string;
    agent?: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
}

export default function PropertyDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        setIsLoggedIn(!!session.data?.user);
      } catch (err) {
        console.error("Failed to get session:", err);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const result = await getPropertyById(params.id);

        if (result.success && result.data) {
          setProperty(result.data);
        } else {
          setError(result.error || "Property not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load property",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg h-96 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-lg h-32 animate-pulse" />
              <div className="bg-white dark:bg-slate-800 rounded-lg h-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">
              {error || "Property not found"}
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  const images = property.propertyImages?.map((img) => img.url) || [
    property.thumbnail,
  ];

  const statusColor = {
    AVAILABLE:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    SOLD: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    RENTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  const listingTypeDisplay =
    property.listingType === "RENT" ? "For Rent" : "For Sale";

  const formatPrice = (price: number) => {
    if (property.listingType === "RENT") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const averageRating =
    property.reviews && property.reviews.length > 0
      ? (
          property.reviews.reduce((sum, r) => sum + r.rating, 0) /
          property.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Image Gallery */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {images.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${property.title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 hidden sm:flex" />
              <CarouselNext className="right-4 hidden sm:flex" />
            </Carousel>
          ) : (
            <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
              <img
                src={images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header with Price and Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 break-words">
                    {property.title}
                  </h1>
                  <div className="flex items-start sm:items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="break-words">{property.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      className={
                        statusColor[
                          property.status as keyof typeof statusColor
                        ] || ""
                      }
                    >
                      {property.status}
                    </Badge>
                    <Badge variant="outline">{property.type}</Badge>
                    <Badge variant="outline">{listingTypeDisplay}</Badge>
                    {property.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(property.price)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setSaved(!saved)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Heart
                    className={`w-4 h-4 ${saved ? "fill-current text-red-600" : ""}`}
                  />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <Card className="p-6 mb-6 border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Property Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <BedDouble className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {property.bedrooms}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Bedrooms
                  </p>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {property.bathrooms}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Bathrooms
                  </p>
                </div>
                <div className="text-center">
                  <Maximize className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {property.area.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    sqft
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400 mb-2 wrap-break-word leading-tight">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Price
                  </p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 mb-6 border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                About This Property
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {property.description}
              </p>
            </Card>

            {/* Reviews Section */}
            <ReviewForm
              propertyId={property.id}
              isLoggedIn={isLoggedIn}
              existingReviews={
                property.reviews
                  ? property.reviews.map((r) => ({
                      id: r.id,
                      rating: r.rating,
                      comment: r.comment,
                      createdAt: r.createdAt || new Date().toISOString(),
                      reviewerName: r.agent?.name,
                    }))
                  : []
              }
              onReviewSubmitted={() => {
                // Refresh the page to get updated reviews
                window.location.reload();
              }}
            />
          </div>

          {/* Sidebar - Agent Info & Contact */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <Card
              className={`p-6 mb-6 bg-linear-to-br border-blue-200 dark:border-blue-800 ${
                property.status === "SOLD"
                  ? "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
                  : property.status === "RENTED"
                    ? "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
                    : "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
              }`}
            >
              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                  {property.status === "SOLD"
                    ? "Property Status"
                    : property.status === "RENTED"
                      ? "Property Status"
                      : "Start Your Journey"}
                </p>
                {property.status === "SOLD" || property.status === "RENTED" ? (
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {property.status === "SOLD"
                      ? "Already Sold"
                      : "Already Rented"}
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(property.price)}
                  </p>
                )}
              </div>
              <BookPropertyModal
                propertyId={property.id}
                propertyTitle={property.title}
                propertyPrice={property.price}
                agentId={property.agent?.id || ""}
                isLoggedIn={isLoggedIn}
                status={property.status}
              />
              {!isLoggedIn &&
                property.status !== "SOLD" &&
                property.status !== "RENTED" && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 text-center font-medium">
                    First login your account
                  </p>
                )}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 text-center">
                {property.status === "SOLD" || property.status === "RENTED" ? (
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    This property is no longer available for booking
                  </span>
                ) : (
                  <>Full property price will be charged at checkout</>
                )}
              </p>
            </Card>

            {/* Agent Card */}
            {property.agent && (
              <Card className="p-6 mb-6 border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Agent Information
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={property.agent.image || ""} />
                    <AvatarFallback>
                      {property.agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {property.agent.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Real Estate Agent
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Contact Methods */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowPhoneDialog(true)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Phone className="w-4 h-4" />
                    Call Agent
                  </Button>
                  <Button
                    onClick={() => {
                      const subject = `Inquiry about ${property.title}`;
                      const body = `Hi ${property.agent?.name},\n\nI am interested in learning more about this property.\n\nThank you!`;
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${property.agent?.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      window.open(gmailUrl, "_blank");
                    }}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>

                <Separator className="my-4" />

                {/* Contact Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 shrink-0" />
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="break-all hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {property.agent.email}
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Info Card */}
            <Card className="p-6 border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Property Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Type:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Status:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {property.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Listed:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-600 dark:text-slate-400">
                    Location:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white text-right break-words">
                    {property.location}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Properties Link */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Link href="/properties">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              ← View More Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Call Agent Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Contact Agent</DialogTitle>
            <DialogDescription>{property.agent?.name}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoggedIn ? (
              <div className="space-y-4">
                {property.agent?.phone ? (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Agent's Phone Number:
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {property.agent.phone}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <a href={`tel:${property.agent.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  </>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    Phone number not available. Please use email to contact.
                  </p>
                )}
                <Button
                  onClick={() => {
                    const subject = `Inquiry about ${property.title}`;
                    const body = `Hi ${property.agent?.name},\n\nI am interested in learning more about this property.\n\nThank you!`;
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${property.agent?.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailUrl, "_blank");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Agent
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Please log in to view the agent's contact information.
                </p>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
