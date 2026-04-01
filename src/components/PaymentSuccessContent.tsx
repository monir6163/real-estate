"use client";

import { confirmCheckoutSession } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verifyAndConfirm = async () => {
      if (!sessionId) {
        if (isMounted) {
          setConfirmError("Missing checkout session id.");
          setIsLoading(false);
        }
        return;
      }

      const result = await confirmCheckoutSession(sessionId);

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setConfirmError(
          result.error || "Failed to confirm payment with the server.",
        );
      }

      setIsLoading(false);
    };

    verifyAndConfirm();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-0 shadow-xl">
        <div className="p-8 text-center">
          {isLoading ? (
            <div className="flex justify-center mb-6">
              <div className="animate-spin">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Successful!
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Thank you for your payment
          </p>

          {sessionId && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 break-all">
              Session ID: {sessionId}
            </p>
          )}

          {confirmError ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-sm text-red-800 dark:text-red-200">
                Payment succeeded, but we could not finalize your booking yet.
                Please refresh this page once or contact support with your
                session id.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
              <p className="text-sm text-green-800 dark:text-green-200">
                Your booking has been confirmed and payment has been processed
                successfully. You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/properties">Browse More Properties</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Need help? Contact our support team
            </p>
            <a
              href="mailto:support@realestate.com"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              support@realestate.com
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
