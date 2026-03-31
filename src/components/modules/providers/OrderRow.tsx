"use client";

import { updateOrderStatusProvider } from "@/actions/getProviders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { Mail, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface OrderRowProps {
  order: any;
}

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "COOKING", label: "Cooking" },
  { value: "ON_THE_WAY", label: "On The Way" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrderRow({ order }: OrderRowProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      ACCEPTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      COOKING: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      ON_THE_WAY: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
      CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === order.status) return;

    setIsUpdating(true);
    const toastId = toast.loading("Updating order status...");

    const res = await updateOrderStatusProvider(order.id, newStatus);

    if (res?.data?.success) {
      toast.success("Order status updated successfully", { id: toastId });
      router.refresh();
    } else {
      toast.error(res?.message || "Failed to update order status", {
        id: toastId,
      });
    }

    setIsUpdating(false);
  };

  return (
    <TableRow key={order.id}>
      <TableCell className="font-medium">
        {order.orderNumber || order.id.slice(0, 8)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {formatStatus(order.status)}
          </Badge>
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={
              isUpdating ||
              order.status === "DELIVERED" ||
              order.status === "CANCELLED"
            }
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    disabled={
                      order.status === "DELIVERED" ||
                      order.status === "CANCELLED" ||
                      (order.status === "PENDING" &&
                        status.value === "COOKING") ||
                      (order.status === "PENDING" &&
                        status.value === "ON_THE_WAY") ||
                      (order.status === "PENDING" &&
                        status.value === "DELIVERED")
                    }
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell className="font-semibold">
        ${order.totalAmount.toFixed(2)}
      </TableCell>
      <TableCell className="max-w-50 truncate">{order.address}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(new Date(order.createdAt), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-right">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{order.orderNumber || order.id.slice(0, 8)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Status and Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {formatStatus(order.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Payment Type
                  </p>
                  <p className="font-medium">{order.paymentType || "COD"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Date
                  </p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), "PPp")}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              {order.user && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{order.user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{order.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Delivery Address
                          </p>
                          <p className="font-medium">{order.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      {item.meal?.image && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={item.meal.image}
                            alt={item.meal.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {item.meal?.name || "Unknown Item"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
