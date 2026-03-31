"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProvidersSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalProviders: number;
  filteredCount: number;
}

export function ProvidersSearchFilter({
  searchQuery,
  onSearchChange,
  totalProviders,
  filteredCount,
}: ProvidersSearchFilterProps) {
  return (
    <section className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shop name or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 bg-background"
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredCount} of {totalProviders} providers
          </span>
        </div>
      </div>
    </section>
  );
}
