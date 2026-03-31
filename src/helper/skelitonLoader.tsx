import { Card, CardContent } from "@/components/ui/card";

function CategorySliderSkeleton() {
  return (
    <div className="relative py-16 px-4 md:px-16 bg-linear-to-b from-background via-secondary/20 to-background">
      <div className="mb-10 text-center">
        <div className="h-10 w-64 bg-muted animate-pulse mx-auto mb-2 rounded" />
        <div className="h-6 w-48 bg-muted animate-pulse mx-auto rounded" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="min-w-37.5 h-37.5 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  );
}

function PopularMealsSkeleton() {
  return (
    <section className="py-16 px-4 md:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="h-10 w-64 bg-muted animate-pulse mx-auto mb-3 rounded" />
          <div className="h-6 w-48 bg-muted animate-pulse mx-auto rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-4/3 bg-muted" />
              <CardContent className="p-5 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { CategorySliderSkeleton, PopularMealsSkeleton };
