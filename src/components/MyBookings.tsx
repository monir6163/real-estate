"use client";

import {
  resolveBookingCancellation,
  updateBookingStatus,
} from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error-message";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  thumbnail: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Booking {
  id: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLATION_REQUESTED"
    | "CANCELLED";
  message?: string;
  visitDate?: string;
  createdAt: string;
  property: Property;
  agent: Agent;
  payment?: {
    status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
    amount?: number;
  };
}

interface MyBookingsProps {
  bookings: Booking[];
}

export default function MyBookings({ bookings }: MyBookingsProps) {
  const [isPending, startTransition] = useTransition();

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Bookings Yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-sm">
            You haven't made any property bookings yet. Explore available
            properties and make your first booking.
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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const canApproveBooking = (visitDate?: string) => {
    if (!visitDate) return true;
    const visitTime = new Date(visitDate).getTime();
    if (Number.isNaN(visitTime)) return true;
    return visitTime <= now;
  };

  const getVisitCountdown = (visitDate?: string) => {
    if (!visitDate) return null;
    const visitTime = new Date(visitDate).getTime();
    if (Number.isNaN(visitTime)) return null;

    const diff = visitTime - now;
    if (diff <= 0) return "Visit time reached";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m ${seconds}s`;
    }

    return `Starts in ${minutes}m ${seconds}s`;
  };

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
          getErrorMessage(
            error,
            "Could not update booking status. Please try again.",
          ),
        );
        setProcessingId(null);
      }
    });
  };

  const handleCancellationDecision = (
    bookingId: string,
    decision: "APPROVE" | "REJECT",
  ) => {
    setProcessingId(bookingId);
    startTransition(async () => {
      try {
        const result = await resolveBookingCancellation(bookingId, decision);

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success(result.message);
        window.location.reload();
      } catch (error) {
        console.error("Error resolving cancellation request:", error);
        toast.error(
          getErrorMessage(
            error,
            "Could not resolve cancellation request. Please try again.",
          ),
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
      case "CANCELLATION_REQUESTED":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancellation Requested
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
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
      {bookings.map((booking) => {
        const canApprove = canApproveBooking(booking.visitDate);
        const countdown = getVisitCountdown(booking.visitDate);

        return (
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
              {/* User/Agent Info */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-3">
                  User Information
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Name
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {booking?.agent?.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Email
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 break-all">
                        {booking?.agent?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Phone
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {booking?.agent?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                  {booking.status === "PENDING" && countdown && (
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">
                      {countdown}
                    </p>
                  )}
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
                    disabled={
                      processingId === booking.id || isPending || !canApprove
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingId === booking.id && isPending ? (
                      "Approving..."
                    ) : !canApprove ? (
                      (countdown ?? "Approve after visit date")
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

              {booking.status === "CANCELLATION_REQUESTED" && (
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    User requested cancellation for a paid booking. Approve to
                    issue refund.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() =>
                        handleCancellationDecision(booking.id, "APPROVE")
                      }
                      disabled={processingId === booking.id || isPending}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {processingId === booking.id && isPending
                        ? "Processing..."
                        : "Approve + Refund"}
                    </Button>
                    <Button
                      onClick={() =>
                        handleCancellationDecision(booking.id, "REJECT")
                      }
                      disabled={processingId === booking.id || isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      {processingId === booking.id && isPending
                        ? "Processing..."
                        : "Reject Request"}
                    </Button>
                  </div>
                </div>
              )}

              {booking.status !== "PENDING" &&
                booking.status !== "CANCELLATION_REQUESTED" && (
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
        );
      })}
    </div>
  );
}
