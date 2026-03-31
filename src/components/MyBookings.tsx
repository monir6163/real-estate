"use client";

import { updateBookingStatus } from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  thumbnail: string;
}

interface Booking {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message?: string;
  visitDate?: string;
  createdAt: string;
  property: Property;
}

interface MyBookingsProps {
  bookings: Booking[];
}

export default function MyBookings({ bookings }: MyBookingsProps) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: "APPROVED" | "REJECTED",
  ) => {
    setProcessingId(bookingId);
    startTransition(async () => {
      try {
        const result = await updateBookingStatus(bookingId, newStatus);

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success(
          result.message || `Booking ${newStatus.toLowerCase()} successfully`,
        );
        // Reload the page to refresh the list
        window.location.reload();
      } catch (error) {
        console.error("Error updating booking status:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update booking status",
        );
        setProcessingId(null);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg border-slate-200 dark:border-slate-700">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No bookings yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          You don't have any booking requests at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {booking.property.title}
                </CardTitle>
                <CardDescription>{booking.property.location}</CardDescription>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Property Details */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Price
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ${booking.property.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Request Date
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            {booking.visitDate && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Requested Visit Date
                </p>
                <p className="text-slate-900 dark:text-white">
                  {new Date(booking.visitDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {booking.message && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Message
                </p>
                <p className="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 p-3 rounded">
                  {booking.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {booking.status === "PENDING" && (
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  onClick={() => handleStatusUpdate(booking.id, "APPROVED")}
                  disabled={processingId === booking.id || isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {processingId === booking.id && isPending ? (
                    "Approving..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(booking.id, "REJECTED")}
                  disabled={processingId === booking.id || isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {processingId === booking.id && isPending ? (
                    "Rejecting..."
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            )}

            {booking.status !== "PENDING" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Status:{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {booking.status}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
