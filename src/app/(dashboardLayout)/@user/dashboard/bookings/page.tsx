"use client";
import { cancelBooking, getMyBookings } from "@/actions/bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Booking {
  id: string;
  propertyId: string;
  status: string;
  visitDate?: string;
  message?: string;
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const result = await getMyBookings();

        if (result.success) {
          setBookings(result.data);
        } else {
          setError(result.error || "Failed to load bookings");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const result = await cancelBooking(bookingId);

      if (!result.success) {
        throw new Error(result.error || "Failed to cancel booking");
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      toast.success(result.message || "Booking cancelled successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel booking",
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
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading bookings...</p>
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
                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/properties/${booking.propertyId}`}>
                    View Property
                  </a>
                </Button>
                {booking.status === "PENDING" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancellingId === booking.id}
                  >
                    {cancellingId === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
