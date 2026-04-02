"use client";

import { checkUserReview, submitReview } from "@/actions/review";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error-message";
import {
  createReviewSchema,
  type CreateReviewFormType,
} from "@/schema/reviewSchema";
import { AlertCircle, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewerName?: string;
}

interface ReviewFormProps {
  propertyId: string;
  isLoggedIn?: boolean;
  onReviewSubmitted?: () => void;
  existingReviews?: Review[];
}

export default function ReviewForm({
  propertyId,
  isLoggedIn = false,
  onReviewSubmitted,
  existingReviews = [],
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateReviewFormType, string>>
  >({});
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserHasReviewed(false);
      setIsLoadingCheck(false);
      return;
    }

    const checkReview = async () => {
      try {
        setIsLoadingCheck(true);
        const result = await checkUserReview(propertyId);
        if (result.data) {
          setUserHasReviewed(true);
        }
      } catch (error) {
        console.error("Error checking review:", error);
      } finally {
        setIsLoadingCheck(false);
      }
    };

    checkReview();
  }, [propertyId, isLoggedIn]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleCommentChange = (value: string) => {
    setComment(value);
    setErrors((prev) => ({ ...prev, comment: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate using Zod schema
    const validationResult = createReviewSchema.safeParse({
      propertyId,
      rating,
      comment,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const newErrors: Partial<Record<keyof CreateReviewFormType, string>> = {};

      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          newErrors[key as keyof CreateReviewFormType] = messages[0];
        }
      });

      setErrors(newErrors);
      toast.error(
        Object.values(newErrors)[0] || "Please check your review details.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitReview(propertyId, rating, comment);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      setRating(5);
      setComment("");
      setErrors({});
      onReviewSubmitted?.();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Could not submit your review. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    existingReviews.length > 0
      ? existingReviews.reduce((sum, r) => sum + r.rating, 0) /
        existingReviews.length
      : 0;

  const renderStars = (value: number, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            disabled={!onChange || isSubmitting}
            className={`transition-all transform ${
              onChange && !isSubmitting
                ? "hover:scale-110 cursor-pointer"
                : "cursor-default"
            }`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 dark:text-slate-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoadingCheck) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submit a Review</CardTitle>
          <CardDescription>
            Share your experience with this property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Existing Reviews Summary */}
      {existingReviews.length > 0 && (
        <Card className="bg-slate-50 dark:bg-slate-700">
          <CardHeader>
            <CardTitle>Reviews ({existingReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-4xl font-bold text-yellow-500">
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex gap-1 mt-2">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-300">
                  Based on {existingReviews.length} review
                  {existingReviews.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {!isLoggedIn ? (
        <Card className="p-6 border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
            Reviews
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Please log in to submit a review for this property.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/login">Go to Login</Link>
          </Button>
        </Card>
      ) : userHasReviewed ? (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  You've Already Reviewed This Property
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  You can only submit one review per property. Visit your
                  profile to view or edit your review.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Review</CardTitle>
            <CardDescription>
              Tell others what you think about this property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Rating *
                </label>
                <div className="flex items-center gap-4">
                  {renderStars(rating, handleRatingChange)}
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {rating === 5
                      ? "Excellent"
                      : rating >= 4
                        ? "Very Good"
                        : rating >= 3
                          ? "Good"
                          : rating >= 2
                            ? "Fair"
                            : "Poor"}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.rating}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <label
                  htmlFor="comment"
                  className="block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  Your Review *
                </label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this property..."
                  value={comment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  rows={4}
                  className={`resize-none ${
                    errors.comment ? "border-red-600 dark:border-red-400" : ""
                  }`}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {comment.length} / 500 characters
                  </p>
                  {errors.comment && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.comment}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Reviews List */}
      {existingReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Reviews
          </h3>
          {existingReviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {review.reviewerName || "Anonymous User"}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {review.comment && (
                  <p className="text-slate-700 dark:text-slate-300">
                    {review.comment}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
