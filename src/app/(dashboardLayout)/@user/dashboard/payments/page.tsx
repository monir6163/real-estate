"use client";
import { getMyPayments } from "@/actions/payments";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error-message";
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  bookingId?: string;
  propertyId: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const result = await getMyPayments();

        if (result.success) {
          setPayments(result.data);
        } else {
          setError(
            result.error || "Could not load your payment history right now.",
          );
        }
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Could not load your payment history right now.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <CreditCard className="w-5 h-5 text-yellow-600" />;
      case "FAILED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case "BOOKING_FEE":
        return "Property Payment";
      case "PREMIUM_LISTING_FEE":
        return "Premium Listing Fee";
      default:
        return purpose;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment History</h1>
          <p className="text-muted-foreground">
            Track all your bookings and payments
          </p>
        </div>

        {/* Summary Skeleton */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </Card>

        {/* Payment Items Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-40 mb-3" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground">
          Track all your bookings and payments
        </p>
      </div>

      {/* Summary Card */}
      {totalSpent > 0 && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Amount Paid
              </p>
              <p className="text-3xl font-bold text-primary">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-primary/50" />
          </div>
        </Card>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <Card className="p-8 text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">
            No payments yet. Start booking properties to make payments.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card
              key={payment.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(payment.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-lg">
                        {getPurposeLabel(payment.purpose)}
                      </p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                    {payment.bookingId && (
                      <p className="text-sm text-muted-foreground">
                        Booking ID: {payment.bookingId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
