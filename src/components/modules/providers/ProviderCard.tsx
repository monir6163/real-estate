import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

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

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden border-2 hover:border-primary/50">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-background group-hover:ring-primary/20 transition-all">
              <AvatarImage
                src={
                  provider.imageUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${provider.shopName}`
                }
                alt={provider.shopName}
              />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                {provider.shopName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">
                {provider.shopName}
              </h3>
              <div className="flex items-center gap-2">
                {provider.verified && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  >
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="truncate">{provider?.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">
                {provider.rating?.toFixed(1) || 5.0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center space-y-1 border-x">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">
                {provider.meals.length || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Meals</p>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">
                {provider.totalOrders || 10}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Orders</p>
          </div>
        </div>

        <Link href={`/providers/${provider?.userId}`} className="w-full">
          <Button
            className="w-full group-hover:bg-primary group-hover:text-white transition-all cursor-pointer"
            variant="outline"
          >
            View Provider
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
