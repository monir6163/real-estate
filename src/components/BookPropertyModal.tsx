"use client";
import { createBooking } from "@/actions/bookings";
import { createBookingCheckout } from "@/actions/payments";
import { getCurrentUser } from "@/actions/users";
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
import { Calendar, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookPropertyModalProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  agentId: string;
}

const BookPropertyModal = ({
  propertyId,
  propertyTitle,
  propertyPrice,
  agentId,
}: BookPropertyModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    const { data } = await getCurrentUser();
    try {
      setLoading(true);
      setError(null);

      if (!visitDate) {
        setError("Please select a visit date");
        setLoading(false);
        return;
      }

      // Step 1: Create the booking
      const bookingResult = await createBooking({
        propertyId,
        agentId: data.id,
        visitDate,
        message: message || undefined,
      });

      if (!bookingResult.success) {
        setError(bookingResult.error || "Failed to create booking");
        setLoading(false);
        return;
      }

      const bookingId = bookingResult.data?.id;
      console.log("Booking created:", bookingId);

      // Step 2: Create checkout session for payment
      const checkoutResult = await createBookingCheckout(bookingId as string);

      if (!checkoutResult.success) {
        setError(checkoutResult.error || "Failed to create checkout session");
        setLoading(false);
        return;
      }

      console.log("Checkout result:", checkoutResult.data);

      // Step 3: Redirect to Stripe checkout
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

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
      >
        Book Now
      </Button>

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

            {/* Booking Fee Info */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm">
              <p className="font-semibold mb-1 text-blue-900 dark:text-blue-100">
                Booking Fee
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                A booking fee of $49.99 will be charged for this reservation.
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
