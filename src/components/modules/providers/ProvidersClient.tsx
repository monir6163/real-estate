"use client";

import { useMemo, useState } from "react";
import { ProviderCard } from "./ProviderCard";
import { ProvidersEmptyState } from "./ProvidersEmptyState";
import { ProvidersSearchFilter } from "./ProvidersSearchFilter";

interface Provider {
  id: string;
  name: string;
  email: string;
  shopName: string;
  address: string;
  rating: number;
  meals: any[];
  totalOrders: number;
  verified: boolean;
  imageUrl?: string;
  userId: string;
}

interface ProvidersClientProps {
  initialProviders: Provider[];
}

export function ProvidersClient({ initialProviders }: ProvidersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = useMemo(() => {
    return initialProviders.filter((provider) => {
      const matchesSearch =
        provider.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.address?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [initialProviders, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery("");
  };

  return (
    <>
      <ProvidersSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProviders={initialProviders.length}
        filteredCount={filteredProviders.length}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProviders.length === 0 ? (
          <ProvidersEmptyState onClearFilters={handleClearFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
