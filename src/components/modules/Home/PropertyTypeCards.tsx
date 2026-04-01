import { getPropertyTypeCounts } from "@/actions/properties";
import { Building2, Home, Landmark, Warehouse } from "lucide-react";
import Link from "next/link";

const PropertyTypeCards = async () => {
  const countsResponse = await getPropertyTypeCounts();
  const counts = countsResponse.data;

  const types = [
    {
      key: "APARTMENT",
      label: "Apartments",
      icon: Building2,
      href: "/properties?type=APARTMENT",
      count: counts.APARTMENT,
    },
    {
      key: "HOUSE",
      label: "Houses",
      icon: Home,
      href: "/properties?type=HOUSE",
      count: counts.HOUSE,
    },
    {
      key: "COMMERCIAL",
      label: "Commercial",
      icon: Warehouse,
      href: "/properties?type=COMMERCIAL",
      count: counts.COMMERCIAL,
    },
    {
      key: "LAND",
      label: "Land",
      icon: Landmark,
      href: "/properties?type=LAND",
      count: counts.LAND,
    },
  ] as const;

  return (
    <section className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">
            Property Types
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Browse By Type
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {types.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.key}
                href={type.href}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {type.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {type.count} properties
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypeCards;
