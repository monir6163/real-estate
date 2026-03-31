"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface OrderItem {
  id: string;
  mealId: string;
  quantity: number;
  price: number;
  meal: {
    id: string;
    name: string;
    price: number;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  providerId: string;
  totalAmount: number;
  status: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
  provider: {
    id: string;
    shopName: string;
    phone: string;
  };
}

interface AllOrdersClientProps {
  orders: Order[];
}

export default function AllOrdersClient({ orders }: AllOrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        color: string;
        icon: React.ReactNode;
      }
    > = {
      PENDING: {
        color:
          "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        icon: <Clock className="h-3 w-3" />,
      },
      CONFIRMED: {
        color:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        icon: <CheckCircle2 className="h-3 w-3" />,
      },
      PREPARING: {
        color:
          "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        icon: <Package className="h-3 w-3" />,
      },
      OUT_FOR_DELIVERY: {
        color:
          "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
        icon: <Truck className="h-3 w-3" />,
      },
      DELIVERED: {
        color:
          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        icon: <CheckCircle2 className="h-3 w-3" />,
      },
      CANCELLED: {
        color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        {config.icon}
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.provider.shopName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: orders.filter((o) => o.status === "PENDING").length,
    confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
    preparing: orders.filter((o) => o.status === "PREPARING").length,
    outForDelivery: orders.filter((o) => o.status === "OUT_FOR_DELIVERY")
      .length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">
                {formatCurrency(stats.revenue)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">{stats.delivered}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div className="text-2xl font-bold">
                {stats.pending +
                  stats.confirmed +
                  stats.preparing +
                  stats.outForDelivery}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-yellow-500/5">
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground mb-1">Pending</div>
            <div className="text-xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5">
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground mb-1">Confirmed</div>
            <div className="text-xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5">
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground mb-1">Preparing</div>
            <div className="text-xl font-bold">{stats.preparing}</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-500/5">
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground mb-1">
              Out for Delivery
            </div>
            <div className="text-xl font-bold">{stats.outForDelivery}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by order number, provider, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PREPARING">Preparing</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Orders ({filteredOrders.length} of {orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No orders found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.provider.shopName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.provider.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.items
                            .slice(0, 2)
                            .map((item) => item.meal.name)
                            .join(", ")}
                          {order.items.length > 2 && "..."}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.address}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
