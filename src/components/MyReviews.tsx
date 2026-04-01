"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Star } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  property: {
    id: string;
    title: string;
    location: string;
    thumbnail: string;
  };
}

interface MyReviewsProps {
  reviews: Review[];
}

export default function MyReviews({ reviews }: MyReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-sm">
            You haven't submitted any reviews yet. After booking a property, you
            can share your experience.
          </p>
          <Link href="/properties">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Browse Properties
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (rating >= 3.5)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (rating >= 2.5)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg border-slate-200 dark:border-slate-700">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No reviews yet
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card
          key={review.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {review.property.title}
                </CardTitle>
                <CardDescription>{review.property.location}</CardDescription>
                {review.user && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">{review.user.name}</span>
                    {review.user.role && (
                      <>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {review.user.role}
                        </Badge>
                      </>
                    )}
                    <span>•</span>
                    <span className="text-xs text-slate-400">
                      {review.user.id}
                    </span>
                  </div>
                )}
              </div>
              <Badge className={getRatingColor(review.rating)}>
                {review.rating.toFixed(1)} / 5
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Star Rating */}
            <div className="flex items-center gap-3">
              {renderStars(review.rating)}
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {review.rating === 5
                  ? "Excellent"
                  : review.rating >= 4
                    ? "Very Good"
                    : review.rating >= 3
                      ? "Good"
                      : review.rating >= 2
                        ? "Fair"
                        : "Poor"}
              </span>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-slate-900 dark:text-slate-100">
                  {review.comment}
                </p>
              </div>
            )}

            {/* Review Date and User Email */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Review Date
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              {review.user?.email && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Reviewer Email
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white font-mono">
                    {review.user.email}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
