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
import { AlertCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ReviewFormProps {
  propertyId: string;
  onReviewSubmitted?: () => void;
  existingReviews?: Review[];
}

export default function ReviewForm({
  propertyId,
  onReviewSubmitted,
  existingReviews = [],
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>(
    {},
  );
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  useEffect(() => {
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
  }, [propertyId]);

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

    const newErrors: { rating?: string; comment?: string } = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!comment.trim()) {
      newErrors.comment = "Please enter a comment";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
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
        error instanceof Error ? error.message : "Failed to submit review",
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
      {userHasReviewed ? (
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
                  <div className="flex gap-1">
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
