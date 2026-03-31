"use client";

import { createReview } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  mealId: string;
  quantity: number;
  price: number;
  meal: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  orderId: string;
}

export function ReviewDialog({
  isOpen,
  onClose,
  orderItems,
  orderId,
}: ReviewDialogProps) {
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMeal = orderItems[selectedMealIndex];

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReview({
        mealId: currentMeal.mealId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (result.status) {
        toast.success("Review submitted successfully!");

        // Check if there are more meals to review
        if (selectedMealIndex < orderItems.length - 1) {
          setSelectedMealIndex(selectedMealIndex + 1);
          setRating(0);
          setComment("");
        } else {
          // All meals reviewed, close dialog
          onClose();
          setSelectedMealIndex(0);
          setRating(0);
          setComment("");
        }
      } else {
        toast.error(result.message || "Failed to submit review");

        // If already reviewed, automatically skip to next meal
        if (
          result.message?.includes("already reviewed") &&
          selectedMealIndex < orderItems.length - 1
        ) {
          setTimeout(() => {
            setSelectedMealIndex(selectedMealIndex + 1);
            setRating(0);
            setComment("");
          }, 1500);
        }
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (selectedMealIndex < orderItems.length - 1) {
      setSelectedMealIndex(selectedMealIndex + 1);
      setRating(0);
      setComment("");
    } else {
      onClose();
      setSelectedMealIndex(0);
      setRating(0);
      setComment("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {currentMeal?.meal?.name}
            {orderItems.length > 1 && (
              <span className="text-xs block mt-1">
                ({selectedMealIndex + 1} of {orderItems.length} items)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Meal Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {currentMeal?.meal?.image && (
              <img
                src={currentMeal.meal.image}
                alt={currentMeal.meal.name}
                className="w-16 h-16 rounded-md object-cover"
              />
            )}
            <div>
              <p className="font-semibold">{currentMeal?.meal?.name}</p>
              <p className="text-sm text-muted-foreground">
                Quantity: {currentMeal?.quantity}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (Optional)</label>
            <Textarea
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {orderItems.length > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              Skip
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
