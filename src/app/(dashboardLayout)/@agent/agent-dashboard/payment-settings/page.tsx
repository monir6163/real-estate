"use client";

import { getPaymentSettings, updatePaymentSettings } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentSettings {
  id: string;
  bookingFeeAmount: number;
  premiumListingFeeAmount: number;
  currency: string;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [bookingFee, setBookingFee] = useState<string>("");
  const [premiumFee, setPremiumFee] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [isDirty, setIsDirty] = useState(false);

  // Load current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getPaymentSettings();

        if (result.success && result.data) {
          setSettings(result.data);
          setBookingFee(result.data.bookingFeeAmount.toString());
          setPremiumFee(result.data.premiumListingFeeAmount.toString());
          setCurrency(result.data.currency);
          setIsDirty(false);
        } else {
          setError(result.error || "Failed to load settings");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load settings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Track when form is modified
  const handleInputChange = () => {
    setIsDirty(true);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const bookingFeeNum = parseFloat(bookingFee);
    const premiumFeeNum = parseFloat(premiumFee);

    if (
      isNaN(bookingFeeNum) ||
      isNaN(premiumFeeNum) ||
      bookingFeeNum < 0 ||
      premiumFeeNum < 0
    ) {
      toast.error(
        "Please enter valid fee amounts (must be non-negative numbers)",
      );
      return;
    }

    if (!currency.trim()) {
      toast.error("Please select a currency");
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const result = await updatePaymentSettings(
        bookingFeeNum,
        premiumFeeNum,
        currency,
      );

      if (result.success) {
        setSettings(result.data);
        setIsDirty(false);
        toast.success(
          result.message || "Payment settings updated successfully",
        );
      } else {
        setError(result.error || "Failed to update settings");
        toast.error(result.error || "Failed to update settings");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update settings";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/agent-dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your booking and listing fees
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Settings Form */}
        <Card className="p-8 bg-white dark:bg-slate-800 border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Fee */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Booking Fee Amount
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={bookingFee}
                    onChange={(e) => {
                      setBookingFee(e.target.value);
                      handleInputChange();
                    }}
                    placeholder="Enter booking fee amount"
                    className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-16">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Fee charged when users make a booking on your properties
              </p>
            </div>

            {/* Premium Fee */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Premium Listing Fee Amount
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={premiumFee}
                    onChange={(e) => {
                      setPremiumFee(e.target.value);
                      handleInputChange();
                    }}
                    placeholder="Enter premium listing fee amount"
                    className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-16">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Fee charged for premium property listings
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Currency
              </label>
              <Input
                type="text"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value.toUpperCase());
                  handleInputChange();
                }}
                placeholder="e.g., USD, EUR, GBP"
                className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 uppercase"
                maxLength={3}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Currency code (3 letters)
              </p>
            </div>

            {/* Current Values Display */}
            {settings && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Current Settings
                    </p>
                    <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                      <li>
                        • Booking Fee:{" "}
                        <span className="font-medium">
                          {settings.bookingFeeAmount} {settings.currency}
                        </span>
                      </li>
                      <li>
                        • Premium Fee:{" "}
                        <span className="font-medium">
                          {settings.premiumListingFeeAmount} {settings.currency}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!isDirty || updating}
                className={`flex-1 ${
                  !isDirty ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Settings"
                )}
              </Button>
              <button
                type="reset"
                onClick={() => {
                  if (settings) {
                    setBookingFee(settings.bookingFeeAmount.toString());
                    setPremiumFee(settings.premiumListingFeeAmount.toString());
                    setCurrency(settings.currency);
                    setIsDirty(false);
                  }
                }}
                disabled={!isDirty}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Reset
              </button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 border-0">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            How it works
          </h3>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>
              • <strong>Booking Fee:</strong> Applied each time a user books one
              of your properties
            </li>
            <li>
              • <strong>Premium Listing Fee:</strong> Applied when you list a
              property as premium
            </li>
            <li>• All fees are collected during the payment process</li>
            <li>• Changes take effect immediately for new transactions</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
