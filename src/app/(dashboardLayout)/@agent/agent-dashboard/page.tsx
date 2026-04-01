"use client";

import { ownerBookings } from "@/actions/properties";
import { getAgentReviews } from "@/actions/review";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error-message";
import {
  BarChart3,
  BookOpen,
  CircleDollarSign,
  Home,
  MessageSquare,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BookingData {
  id: string;
  status: string;
  createdAt?: string;
  payment?: {
    status?: string;
    amount?: number;
  };
}

interface ReviewData {
  id: string;
  rating: number;
  property?: {
    id: string;
    title: string;
  };
}

export default function AgentDashboard() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bookingsResult, reviewsResult] = await Promise.all([
          ownerBookings(),
          getAgentReviews(),
        ]);

        if (bookingsResult.success) {
          setBookings(bookingsResult.data || []);
        }

        if (reviewsResult.status) {
          setReviews(reviewsResult.data || []);
        }
      } catch (err) {
        setError(
          getErrorMessage(err, "Could not load dashboard data right now."),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const approvedBookings = bookings.filter(
    (b) => b.status === "APPROVED",
  ).length;
  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;
  const totalEarnings = bookings.reduce((sum, booking) => {
    const isSuccessfulPayment =
      booking.payment?.status?.toUpperCase() === "SUCCESS";
    const amount = Number(booking.payment?.amount || 0);
    if (!isSuccessfulPayment || !Number.isFinite(amount) || amount <= 0) {
      return sum;
    }
    return sum + amount;
  }, 0);
  const formattedTotalEarnings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(totalEarnings);

  const propertyRatings = Object.values(
    reviews.reduce(
      (acc, review) => {
        if (!review.property?.id) {
          return acc;
        }

        const { id, title } = review.property;
        if (!acc[id]) {
          acc[id] = {
            propertyId: id,
            title,
            totalRating: 0,
            reviewCount: 0,
          };
        }

        acc[id].totalRating += review.rating;
        acc[id].reviewCount += 1;
        return acc;
      },
      {} as Record<
        string,
        {
          propertyId: string;
          title: string;
          totalRating: number;
          reviewCount: number;
        }
      >,
    ),
  )
    .map((item) => ({
      ...item,
      averageRating: item.totalRating / item.reviewCount,
    }))
    .sort((a, b) => b.averageRating - a.averageRating);

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      const status = booking.status?.toLowerCase();
      if (status in acc) {
        acc[status as keyof typeof acc] += 1;
      }
      return acc;
    },
    {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancellation_requested: 0,
      cancelled: 0,
    },
  );

  const bookingStatusData = [
    {
      name: "Pending",
      value: statusCounts.pending,
      color: "#3b82f6",
    },
    {
      name: "Approved",
      value: statusCounts.approved,
      color: "#16a34a",
    },
    {
      name: "Rejected",
      value: statusCounts.rejected,
      color: "#ef4444",
    },
    {
      name: "Cancel Requested",
      value: statusCounts.cancellation_requested,
      color: "#f59e0b",
    },
    {
      name: "Cancelled",
      value: statusCounts.cancelled,
      color: "#64748b",
    },
  ].filter((item) => item.value > 0);

  const ratingDistributionData = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating}★`,
    count: reviews.filter((review) => Math.round(review.rating) === rating)
      .length,
  }));

  return (
    <div className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Agent Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your properties, bookings, and track your performance
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-8 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-12">
          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Pending Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : pendingBookings}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Approved Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : approvedBookings}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : totalReviews}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : averageRating}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white break-all">
                  {loading ? "-" : formattedTotalEarnings}
                </p>
              </div>
              <CircleDollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/agent-dashboard/my-properties">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    My Properties
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Manage and view all your listed properties
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  View All
                </Button>
              </Card>
            </Link>

            <Link href="/agent-dashboard/my-bookings">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Booking Requests
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Review and manage booking requests
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  Manage
                </Button>
              </Card>
            </Link>

            <Link href="/agent-dashboard/my-reviews">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Reviews & Ratings
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  View customer feedback and ratings
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  View Reviews
                </Button>
              </Card>
            </Link>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-white dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Booking Status Breakdown
            </h2>
            {loading ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Loading chart data...
              </p>
            ) : bookingStatusData.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No bookings yet to visualize.
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {bookingStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Rating Distribution
            </h2>
            {loading ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Loading chart data...
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No reviews yet to visualize.
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistributionData}>
                    <XAxis dataKey="rating" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Property Ratings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Property Ratings
          </h2>
          <Card className="p-6 bg-white dark:bg-slate-800">
            {loading ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Loading property ratings...
              </p>
            ) : propertyRatings.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No ratings found for your properties yet.
              </p>
            ) : (
              <div className="space-y-3">
                {propertyRatings.map((item) => (
                  <div
                    key={item.propertyId}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700"
                  >
                    <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">
                        {item.averageRating.toFixed(1)} / 5
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        ({item.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Settings
            </h2>
          </div>
          <Card className="p-6 bg-white dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No additional dashboard settings available right now.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
