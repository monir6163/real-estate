"use client";

import { deleteReview, getAllReviews } from "@/actions/review";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error-message";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ReviewItem {
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
  property?: {
    id: string;
    title: string;
    thumbnail?: string;
    location?: string;
  };
}

const renderStars = (rating: number) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
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

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const handleDeleteReview = async (reviewId: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      const result = await deleteReview(reviewId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Could not delete this review right now."),
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getAllReviews();
        if (result.status) {
          const reviewData = Array.isArray(result.data)
            ? result.data
            : result.data
              ? [result.data]
              : [];
          setReviews(reviewData);
        } else {
          setError(result.message || "Could not load reviews right now.");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Could not load reviews right now."));
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return reviews.filter((review) => {
      const bySearch =
        !term ||
        review.property?.title?.toLowerCase().includes(term) ||
        review.user?.name?.toLowerCase().includes(term) ||
        review.user?.email?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term);

      const byRating =
        ratingFilter === "ALL" || review.rating >= Number(ratingFilter);

      return Boolean(bySearch && byRating);
    });
  }, [reviews, searchTerm, ratingFilter]);

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;
  const latest7Days = reviews.filter((review) => {
    const createdMs = new Date(review.createdAt).getTime();
    const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return createdMs >= sevenDaysAgoMs;
  }).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/admin-dashboard"
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            All Reviews
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor all property reviews across the platform.
          </p>
        </div>

        {error && (
          <Card className="mb-6 flex items-start gap-3 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </Card>
        )}

        {!loading && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-white p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Reviews
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {totalReviews}
              </p>
            </Card>
            <Card className="bg-white p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Average Rating
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {totalReviews > 0 ? `${avgRating.toFixed(1)} / 5` : "N/A"}
              </p>
            </Card>
            <Card className="bg-white p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last 7 Days
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {latest7Days}
              </p>
            </Card>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="bg-white p-4 dark:bg-slate-800">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by property, reviewer, email, comment"
              className="border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-700"
            />
          </Card>
          <Card className="bg-white p-4 dark:bg-slate-800">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="ALL">All Ratings</option>
              <option value="4">4★ & up</option>
              <option value="3">3★ & up</option>
              <option value="2">2★ & up</option>
            </select>
          </Card>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card className="bg-white p-12 text-center dark:bg-slate-800">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
              No reviews found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your filters or search keyword.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card
                key={review.id}
                className="overflow-hidden bg-white transition-shadow hover:shadow-lg dark:bg-slate-800"
              >
                <div className="space-y-4 p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.property?.title || "Unknown property"}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {review.user?.name || "Unknown reviewer"}
                        {review.user?.email ? ` • ${review.user.email}` : ""}
                      </p>
                    </div>
                    <Badge className={getRatingColor(review.rating)}>
                      {review.rating.toFixed(1)} / 5
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    {renderStars(review.rating)}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReviewId === review.id}
                      className="gap-2"
                    >
                      {deletingReviewId === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete Review
                    </Button>
                  </div>

                  {review.comment ? (
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                      <p className="text-slate-900 dark:text-slate-100">
                        {review.comment}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                      No comment provided.
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
