import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

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
  phone?: string;
  description?: string;
  createdAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ProviderDetailsHeroProps {
  provider: Provider;
}

export function ProviderDetailsHero({ provider }: ProviderDetailsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
      <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info Card */}
          <Card className="lg:col-span-2 border-2 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                  <AvatarImage
                    src={
                      provider.imageUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${provider.shopName}`
                    }
                    alt={provider.shopName}
                  />
                  <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-primary-foreground text-3xl font-bold">
                    {provider.shopName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {provider.shopName}
                      </h1>
                      {provider.verified && (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {"Quality food provider"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{provider.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{provider.user.email}</span>
                    </div>
                    {provider.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{provider.phone}</span>
                      </div>
                    )}
                    {provider.createdAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          Joined{" "}
                          {new Date(provider.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            {/* Description */}
            <div className="w-full px-8 pb-8">
              <p className="text-sm text-muted-foreground text-justify">
                {provider.description ||
                  "This provider has not added a description yet."}
              </p>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="border-2 shadow-2xl bg-linear-to-br from-primary/5 to-background">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6">Statistics</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background border-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                      <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="text-2xl font-bold">
                        {provider.rating?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(provider.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-background border-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Meals
                      </p>
                      <p className="text-2xl font-bold">
                        {provider.meals.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-background border-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold">
                        {provider.totalOrders || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
