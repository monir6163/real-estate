"use client";

import { getAllBookings } from "@/actions/bookings";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error-message";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  visitDate?: string;
  createdAt: string;
  message?: string;
  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getAllBookings();

        if (result.success) {
          const bookingsData = Array.isArray(result.data)
            ? result.data
            : result.data?.data
              ? Array.isArray(result.data.data)
                ? result.data.data
                : [result.data.data]
              : [];
          setBookings(bookingsData);
          setFilteredBookings(bookingsData);
        } else {
          setError(result.error || "Could not load bookings right now.");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Could not load bookings right now."));
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = bookings.filter(
      (booking) =>
        booking.property?.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.property?.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.agent?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filterStatus !== "ALL") {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, filterStatus, bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const stats = {
    pending: bookings.filter((b) => b.status === "PENDING").length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    rejected: bookings.filter((b) => b.status === "REJECTED").length,
  };

  return (
    <div className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin-dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            All Bookings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor and manage booking requests
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-white dark:bg-slate-800">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                Pending
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.pending}
              </p>
            </Card>
            <Card className="p-4 bg-white dark:bg-slate-800">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                Approved
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.approved}
              </p>
            </Card>
            <Card className="p-4 bg-white dark:bg-slate-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                Rejected
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.rejected}
              </p>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white dark:bg-slate-800">
            <Input
              type="text"
              placeholder="Search by property, location, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
            />
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </Card>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-800">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || filterStatus !== "ALL"
                ? "Try adjusting your filters"
                : "No bookings available"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Property Info */}
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Property
                    </p>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {booking.property?.title || "N/A"}
                    </h3>
                    {booking.property?.location && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.property.location}
                      </p>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      User
                    </p>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {booking.agent?.name || "N/A"}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {booking.agent?.email || "N/A"}
                    </p>
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Dates
                    </p>
                    {booking.visitDate && (
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">
                        {new Date(booking.visitDate).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Requested:{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status & Price */}
                  <div className="flex flex-col items-end justify-between">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    {booking.property?.price && (
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${booking.property.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                {booking.message && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Message
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-2 rounded">
                      {booking.message}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Total Count */}
        {!loading && (
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            <p>
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
