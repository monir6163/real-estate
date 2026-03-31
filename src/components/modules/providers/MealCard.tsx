"use client";

import { deleteMealProvider, updateMealProvider } from "@/actions/getProviders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface MealCardProps {
  meal: any;
}

export default function MealCard({ meal }: MealCardProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting meal...");

    const res = await deleteMealProvider(meal.id);

    if (res?.data?.success) {
      toast.success("Meal deleted successfully", { id: toastId });
      router.refresh();
    } else {
      toast.error(res?.message || "Failed to delete meal", { id: toastId });
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
  };

  const handleToggleAvailability = async () => {
    setIsTogglingAvailability(true);
    const toastId = toast.loading("Updating availability...");

    const res = await updateMealProvider(meal.id, {
      isAvailable: !meal.isAvailable,
    });

    if (res?.data?.success) {
      toast.success(
        `Meal marked as ${!meal.isAvailable ? "available" : "unavailable"}`,
        { id: toastId },
      );
      router.refresh();
    } else {
      toast.error(res?.message || "Failed to update availability", {
        id: toastId,
      });
    }

    setIsTogglingAvailability(false);
  };

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-muted overflow-hidden">
          {meal?.image ? (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge
              variant={meal.isAvailable ? "default" : "secondary"}
              className="shadow-sm"
            >
              {meal.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">
                {meal.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {meal.description || "No description"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/provider-dashboard/meals/${meal.id}/edit`}>
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleToggleAvailability}
                  disabled={isTogglingAvailability}
                >
                  {meal.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            {meal.cuisine && (
              <Badge variant="outline" className="text-xs">
                {meal.cuisine}
              </Badge>
            )}
            {meal.mealType && (
              <Badge variant="outline" className="text-xs">
                {meal.mealType}
              </Badge>
            )}
            {meal.spiceLevel && (
              <Badge variant="outline" className="text-xs">
                {meal.spiceLevel}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div>
              <p className="text-2xl font-bold">${meal.price}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{meal.calories} cal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              meal "{meal.name}" from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
