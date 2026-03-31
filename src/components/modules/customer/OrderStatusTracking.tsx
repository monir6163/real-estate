"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  ChefHat,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

interface OrderStatusTrackingProps {
  order: {
    id: string;
    status: string;
    orderNumber: string;
    address: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    items?: any[];
    provider?: {
      storeName: string;
      phone?: string;
    };
  };
}

const orderStatusSteps = [
  {
    status: "PENDING",
    label: "Order Placed",
    description: "Your order has been received",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    status: "ACCEPTED",
    label: "Order Accepted",
    description: "Provider confirmed your order",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    status: "COOKING",
    label: "Preparing Food",
    description: "Your meal is being prepared",
    icon: ChefHat,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    status: "ON_THE_WAY",
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: Truck,
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    description: "Order delivered successfully",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
];

export function OrderStatusTracking({ order }: OrderStatusTrackingProps) {
  const currentStatusIndex = orderStatusSteps.findIndex(
    (step) => step.status === order.status,
  );

  const isCancelled = order.status === "CANCELLED";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isCancelled) {
    return (
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-red-500/10">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-600">Order Cancelled</CardTitle>
              <CardDescription>This order has been cancelled</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-900 dark:text-red-100">
                Order #{order.orderNumber} was cancelled.
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Updated: {formatDate(order.updatedAt)}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-medium">#{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Track your order in real-time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Status Timeline */}
        <div className="relative">
          {orderStatusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const Icon = step.icon;
            const isLast = index === orderStatusSteps.length - 1;

            return (
              <div key={step.status} className="relative">
                <div className="flex items-start gap-4 pb-8">
                  {/* Icon Circle */}
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                        isCompleted
                          ? `${step.bgColor} ${step.borderColor} ${step.color}`
                          : "bg-muted border-muted-foreground/20 text-muted-foreground",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-75">
                        <div
                          className={cn(
                            "w-full h-full rounded-full",
                            step.bgColor,
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Vertical Line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-6 top-12 w-0.5 h-full -ml-px transition-all",
                        isCompleted ? "bg-primary" : "bg-muted-foreground/20",
                      )}
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={cn(
                          "font-semibold",
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                      {isCompleted && !isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm",
                        isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60",
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Order Details */}
        <div className="space-y-4">
          <h3 className="font-semibold">Order Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-sm">Order ID</span>
              </div>
              <p className="font-medium pl-6"># {order.orderNumber}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Order Date</span>
              </div>
              <p className="font-medium pl-6">{formatDate(order.createdAt)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Delivery Address</span>
              </div>
              <p className="font-medium pl-6">{order.address}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-sm">Total Amount</span>
              </div>
              <p className="font-medium text-lg pl-6">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.status !== "DELIVERED" && (
          <>
            <Separator />
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your order will be delivered within 30-45 minutes
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delivered Message */}
        {order.status === "DELIVERED" && (
          <>
            <Separator />
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Order Delivered Successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Thank you for your order. We hope you enjoy your meal!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
