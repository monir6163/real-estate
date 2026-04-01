"use client";

import { deleteBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    // Delete booking when user lands on cancel page
    if (bookingId) {
      deleteBooking(bookingId).catch((err) => {
        console.error("Failed to delete booking:", err);
      });
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-0 shadow-xl">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-orange-500" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Cancelled
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Your payment was not completed
          </p>

          {bookingId && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Booking ID: {bookingId}
            </p>
          )}

          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Your booking has been cancelled and no payment was charged. You
              can try booking again anytime.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/properties">Try Booking Again</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">
              Why would you want to cancel?
            </h3>
            <ul className="text-left text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li>✓ No charges were made</li>
              <li>✓ You can book anytime</li>
              <li>✓ Browse more properties</li>
            </ul>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Having issues? Contact our support team
              </p>
              <a
                href="mailto:support@realestate.com"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                support@realestate.com
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
