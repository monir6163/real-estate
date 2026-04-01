"use client";
import { createBookingCheckout } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BookPropertyModalProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  agentId: string;
  isLoggedIn?: boolean;
  status?: string;
}

const BookPropertyModal = ({
  propertyId,
  propertyTitle,
  propertyPrice,
  agentId,
  isLoggedIn = false,
  status = "AVAILABLE",
}: BookPropertyModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!visitDate) {
        setError("Please select a visit date");
        setLoading(false);
        return;
      }

      // Step 1: Create checkout session for payment
      const checkoutResult = await createBookingCheckout({
        propertyId,
        visitDate,
        message: message || undefined,
      });

      if (!checkoutResult.success) {
        setError(checkoutResult.error || "Failed to create checkout session");
        setLoading(false);
        return;
      }

      console.log("Checkout result:", checkoutResult.data);

      // Step 2: Redirect to Stripe checkout
      if (checkoutResult.data?.checkoutUrl) {
        console.log(
          "Redirecting to Stripe URL:",
          checkoutResult.data.checkoutUrl,
        );
        // Use window.location.href for external redirect
        setTimeout(() => {
          window.location.href = checkoutResult.data?.checkoutUrl || "";
        }, 0);
      } else {
        setError(
          "No payment method found. Please try again or contact support.",
        );
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const isPropertyUnavailable = status === "SOLD" || status === "RENTED";
  const canBook = isLoggedIn && !isPropertyUnavailable;

  const getDisabledReason = () => {
    if (!isLoggedIn) {
      return {
        message: "Please log in to book a property",
        action: (
          <Link href="/login" className="text-blue-400 hover:underline">
            Go to Login
          </Link>
        ),
      };
    }
    if (status === "SOLD") {
      return {
        message: "This property has already been sold",
        action: null,
      };
    }
    if (status === "RENTED") {
      return {
        message: "This property has already been rented",
        action: null,
      };
    }
    return null;
  };

  const disabledReason = getDisabledReason();

  return (
    <>
      {canBook ? (
        <Button
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
        >
          Book Now
        </Button>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled className="w-full sm:w-auto opacity-60">
                Book Now
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="mb-2">{disabledReason?.message}</p>
              {disabledReason?.action}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Property</DialogTitle>
            <DialogDescription>
              Schedule a visit for {propertyTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Property Info */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-1">{propertyTitle}</h4>
              <p className="text-lg font-bold text-primary">
                ${propertyPrice.toLocaleString()}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Visit Date */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Preferred Visit Date *
              </label>
              <Input
                type="datetime-local"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose when you'd like to visit the property
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message (Optional)
              </label>
              <Textarea
                placeholder="Share any questions or special requests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-24 resize-none"
              />
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm">
              <p className="font-semibold mb-1 text-blue-900 dark:text-blue-100">
                Payment Amount
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                {`You will be charged $${propertyPrice.toLocaleString()} for this property.`}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookPropertyModal;
