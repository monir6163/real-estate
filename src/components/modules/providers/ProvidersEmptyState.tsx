"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ProvidersEmptyStateProps {
  onClearFilters: () => void;
}

export function ProvidersEmptyState({
  onClearFilters,
}: ProvidersEmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No providers found</h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search or filter criteria
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
