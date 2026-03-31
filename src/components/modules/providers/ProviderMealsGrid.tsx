"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  EyeIcon,
  Flame,
  ShoppingCart,
  Star,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  prepTime?: number;
  calories?: number;
  category?: {
    name: string;
  };
  isAvailable?: boolean;
}

interface ProviderMealsGridProps {
  meals: Meal[];
  providerId: string;
}

export function ProviderMealsGrid({
  meals,
  providerId,
}: ProviderMealsGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (mealId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(mealId)) {
        newFavorites.delete(mealId);
      } else {
        newFavorites.add(mealId);
      }
      return newFavorites;
    });
  };

  if (!meals || meals.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No Meals Available</h3>
          <p className="text-muted-foreground">
            This provider hasn't added any meals yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Available Meals</h2>
        <p className="text-muted-foreground">
          Browse through {meals.length} delicious meal
          {meals.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 py-0"
          >
            <CardHeader className="p-0 relative">
              <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-primary/20 to-primary/5">
                {meal.image ? (
                  <div className="flex items-center justify-center h-full">
                    <Utensils className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Utensils className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-2">
                  {meal?.category && (
                    <Badge className="bg-primary/90 backdrop-blur">
                      {meal.category.name}
                    </Badge>
                  )}
                </div>

                {!meal.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {meal.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {meal.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {meal.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-medium">
                      {meal.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {meal.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{meal.prepTime} min</span>
                  </div>
                )}
                {meal.calories && (
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    <span>{meal.calories} cal</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{meal.price}</span>
              </div>
              <Link
                href={`/meals/${meal.id}`}
                className="inline-flex items-center px-3 py-2 bg-primary/10 text-primary font-medium rounded-md hover:bg-primary/20 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View Meal
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
