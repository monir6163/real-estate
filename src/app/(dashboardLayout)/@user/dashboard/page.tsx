"use client";

import { getMyBookings } from "@/actions/bookings";
import { getMyPayments } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error-message";
import { BookOpen, CreditCard, Heart, Home, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookingData {
  id: string;
  status: string;
  propertyId?: string;
}

interface PaymentData {
  id: string;
  amount: number;
  status: string;
  purpose?: string;
}

export default function UserDashboard() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bookingsResult, paymentsResult] = await Promise.all([
          getMyBookings(),
          getMyPayments(),
        ]);

        if (bookingsResult.success) {
          setBookings(bookingsResult.data || []);
        }

        if (paymentsResult.success) {
          setPayments(paymentsResult.data || []);
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
  const activeBookings = bookings.filter((b) => b.status === "PENDING").length;
  const totalBooked = bookings.length;

  // Saved Properties: TODO - Requires favorites/wishlist feature implementation
  const savedProperties = 0;

  // Properties Count: Unique properties booked
  const propertiesCount = new Set(bookings.map((b) => b.propertyId)).size;
  return (
    <div className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your bookings, payments, and property interests
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-8 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Active Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : activeBookings}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Booked
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : totalBooked}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Saved Properties
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : savedProperties}
                </p>
              </div>
              <Heart className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Properties Count
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : propertiesCount}
                </p>
              </div>
              <Home className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Bookings Card */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                My Bookings
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                View and manage all your property bookings and reservation
                requests
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard/bookings">View My Bookings</Link>
            </Button>
          </Card>

          {/* Payments Card */}
          <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment History
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Track all your payments, invoices, and transaction history
              </p>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/payments">View Payments</Link>
            </Button>
          </Card>

          {/* Browse Properties Card */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Browse Properties
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Explore our collection of featured properties and find your
                dream home
              </p>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link href="/properties">Browse Now</Link>
            </Button>
          </Card>

          {/* Account Settings Card */}
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Account Settings
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Update your profile, preferences, and account security settings
              </p>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/profile">Go to Settings</Link>
            </Button>
          </Card>
        </div>

        {/* Helpful Info Section */}
        <Card className="p-8 bg-white dark:bg-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            How to Book a Property
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white font-semibold">
                  1
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Browse Properties
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Visit the properties page and search for your ideal home
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white font-semibold">
                  2
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Click "Book Now"
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Click the Book Now button on any property to schedule a
                  viewing
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white font-semibold">
                  3
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Set Details
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose your preferred visit date and add any special requests
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white font-semibold">
                  4
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Complete Property Payment
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Complete payment via Stripe to confirm your booking
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white font-semibold">
                  5
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Confirm Booking
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Agent will review and approve your booking request
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
