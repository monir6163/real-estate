"use client";

import { cancelOrder } from "@/actions/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  Package,
  Search,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { ReviewDialog } from "./ReviewDialog";

interface OrderItem {
  id: string;
  mealId: string;
  orderNumber: string;
  quantity: number;
  price: number;
  meal: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Order {
  items: any;
  id: string;
  orderNumber: string;
  userId: string;
  providerId: string;
  address: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  PREPARING: {
    label: "Preparing",
    icon: Package,
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  ON_THE_WAY: {
    label: "On the Way",
    icon: Truck,
    className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export function MyOrders({ orders }: OrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderToReview, setOrderToReview] = useState<Order | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

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

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) {
      return orders;
    }

    const query = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const orderId = order.id?.toLowerCase() || "";
      const orderNumber = order.orderNumber?.toLowerCase() || "";
      const shortOrderId = order.id?.slice(-8).toLowerCase() || "";

      return (
        orderId.includes(query) ||
        orderNumber.includes(query) ||
        shortOrderId.includes(query)
      );
    });
  }, [orders, searchQuery]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelClick = (order: Order) => {
    setOrderToCancel(order);
    setIsCancelDialogOpen(true);
  };

  const handleReviewClick = (order: Order) => {
    setOrderToReview(order);
    setIsReviewDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setIsCancelling(true);
    try {
      const result = await cancelOrder(orderToCancel.id);

      if (result.status) {
        toast.success("Order cancelled successfully");
        setIsCancelDialogOpen(false);
        setOrderToCancel(null);
        // Refresh the page to show updated order status
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You haven&apos;t placed any orders yet. Start exploring our delicious
          meals!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by Order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No orders match &quot;{searchQuery}&quot;. Try a different Order ID.
          </p>
        </div>
      )}

      {/* Orders List */}
      {filteredOrders?.map((order) => {
        const status =
          statusConfig[order.status as keyof typeof statusConfig] ||
          statusConfig.PENDING;
        const StatusIcon = status.icon;

        return (
          <Card key={order.id} className="overflow-hidden">
            <div className="bg-muted/50 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                      Order #{order?.orderNumber}
                    </h3>
                    <Badge variant="outline" className={status.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Delivery Address */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm">{order.address}</p>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <p className="text-sm font-medium mb-3">Order Items</p>
                  <div className="space-y-3">
                    {order?.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
                          {item.meal.image ? (
                            <Image
                              src={item.meal.image}
                              alt={item.meal.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {item.meal.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(item.meal.price * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.meal.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.totalAmount - 5)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 bg-muted/50 px-6 py-4">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleViewDetails(order)}
              >
                View Details
              </Button>
              {order.status === "DELIVERED" && (
                <Button
                  variant="default"
                  className="cursor-pointer gap-2"
                  onClick={() => handleReviewClick(order)}
                >
                  <Star className="w-4 h-4" />
                  Leave Review
                </Button>
              )}
              {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => handleCancelClick(order)}
                >
                  Cancel Order
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        order={selectedOrder}
      />

      {/* Review Dialog */}
      {orderToReview && (
        <ReviewDialog
          isOpen={isReviewDialogOpen}
          onClose={() => {
            setIsReviewDialogOpen(false);
            setOrderToReview(null);
          }}
          orderItems={orderToReview.items || []}
          orderId={orderToReview.id}
        />
      )}

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order #
              {orderToCancel?.orderNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              No, Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
