"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
