"use client";
import { cancelBooking, getMyBookings } from "@/actions/bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error-message";
import { Calendar, MapPin, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Booking {
  id: string;
  propertyId: string;
  status: string;
  visitDate?: string;
  message?: string;
  payment?: {
    status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
    amount?: number;
    updatedAt?: string;
  };
  property?: {
    title: string;
    price: number;
    location: string;
  };
  createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancellationWindowHours = (() => {
    const parsed = Number(
      process.env.NEXT_PUBLIC_BOOKING_CANCELLATION_WINDOW_HOURS || "24",
    );
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
  })();

  const getCancellationTimeRemainingMs = (booking: Booking) => {
    if (
      booking.status !== "APPROVED" ||
      booking.payment?.status !== "SUCCESS" ||
      !booking.payment?.updatedAt
    ) {
      return null;
    }

    const paidAt = new Date(booking.payment.updatedAt).getTime();
    if (Number.isNaN(paidAt)) {
      return null;
    }

    const deadline = paidAt + cancellationWindowHours * 60 * 60 * 1000;
    return deadline - Date.now();
  };

  const formatRemainingTime = (remainingMs: number) => {
    if (remainingMs <= 0) {
      return "Expired";
    }

    const totalMinutes = Math.floor(remainingMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours <= 0) {
      return `${minutes}m left`;
    }

    return `${hours}h ${minutes}m left`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const result = await getMyBookings();

        if (result.success) {
          setBookings(result.data);
        } else {
          setError(result.error || "Could not load your bookings right now.");
        }
      } catch (err) {
        setError(
          getErrorMessage(err, "Could not load your bookings right now."),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find((item) => item.id === bookingId);
    const isCancellationRequest =
      booking?.status === "APPROVED" && booking?.payment?.status === "SUCCESS";

    const confirmed = window.confirm(
      isCancellationRequest
        ? "Request cancellation for this paid booking? It will need admin/provider approval before refund."
        : "Are you sure you want to cancel this booking request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const result = await cancelBooking(bookingId);

      if (!result.success) {
        throw new Error(
          result.error ||
            "Could not process booking cancellation. Please try again.",
        );
      }

      const refreshed = await getMyBookings();
      if (refreshed.success) {
        setBookings(refreshed.data);
      }
      toast.success(
        result.message || "Booking cancellation processed successfully",
      );
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Could not process booking cancellation. Please try again.",
        ),
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "CANCELLATION_REQUESTED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your property booking requests
          </p>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-3" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-3 mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage your property booking requests
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            You haven't made any bookings yet
          </p>
          <Button asChild>
            <a href="/properties">Browse Properties</a>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              {(() => {
                const cancellationRemainingMs =
                  getCancellationTimeRemainingMs(booking);
                const canRequestPaidCancellation =
                  cancellationRemainingMs !== null &&
                  cancellationRemainingMs > 0;
                const paidCancellationWindowExpired =
                  cancellationRemainingMs !== null &&
                  cancellationRemainingMs <= 0;

                return (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {booking.property?.title || "Property"}
                        </h3>
                        {booking.property?.location && (
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            {booking.property.location}
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      {booking.property?.price && (
                        <p className="text-lg font-bold text-primary">
                          ${booking.property.price.toLocaleString()}
                        </p>
                      )}

                      {booking.visitDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.visitDate).toLocaleString()}
                        </div>
                      )}

                      {booking.message && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {booking.message}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Booked on{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>

                      {booking.status === "APPROVED" &&
                        booking.payment?.status === "SUCCESS" && (
                          <p
                            className={`text-sm ${
                              paidCancellationWindowExpired
                                ? "text-destructive"
                                : "text-amber-600"
                            }`}
                          >
                            Cancellation request is allowed within{" "}
                            {cancellationWindowHours} hours after payment
                            success.{" "}
                            {cancellationRemainingMs !== null
                              ? `Status: ${formatRemainingTime(cancellationRemainingMs)}.`
                              : "Time window could not be calculated."}
                          </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/properties/${booking.propertyId}`}>
                          View Property
                        </a>
                      </Button>
                      {(booking.status === "PENDING" ||
                        (booking.status === "APPROVED" &&
                          booking.payment?.status === "SUCCESS" &&
                          canRequestPaidCancellation)) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id
                            ? "Cancelling..."
                            : booking.status === "PENDING"
                              ? "Cancel Booking"
                              : "Request Cancellation"}
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
