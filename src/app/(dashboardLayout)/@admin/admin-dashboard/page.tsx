"use client";

import { getAllBookings } from "@/actions/bookings";
import { getAllProperties } from "@/actions/properties";
import { getAllUsers } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error-message";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CircleDollarSign,
  Home,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [propertiesResult, usersResult, bookingsResult] =
          await Promise.all([
            getAllProperties(),
            getAllUsers(),
            getAllBookings(),
          ]);

        let properties: any[] = [];
        let users: any[] = [];
        let bookings: any[] = [];

        if (propertiesResult.data) {
          properties = Array.isArray(propertiesResult.data)
            ? propertiesResult.data
            : [];
        }
        if (usersResult.data) {
          users = Array.isArray(usersResult.data) ? usersResult.data : [];
        }
        if (bookingsResult.data) {
          bookings = Array.isArray(bookingsResult.data)
            ? bookingsResult.data
            : [];
        }

        const pendingCount = bookings.filter(
          (b: any) => b.status?.toLowerCase() === "pending",
        ).length;

        setBookings(bookings);
        setUsers(users);

        setStats({
          totalProperties: Array.isArray(properties) ? properties.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalBookings: Array.isArray(bookings) ? bookings.length : 0,
          pendingBookings: pendingCount,
        });
      } catch (err) {
        setError(
          getErrorMessage(err, "Could not load dashboard data right now."),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bookingStatusCount = bookings.reduce(
    (acc, booking) => {
      const status = booking.status?.toLowerCase();
      if (status in acc) {
        acc[status as keyof typeof acc] += 1;
      }
      return acc;
    },
    {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancellation_requested: 0,
      cancelled: 0,
      cancellation_rejected: 0,
    },
  );

  const bookingStatusData = [
    {
      name: "Pending",
      value: bookingStatusCount.pending,
      color: "#f59e0b",
    },
    {
      name: "Approved",
      value: bookingStatusCount.approved,
      color: "#22c55e",
    },
    {
      name: "Rejected",
      value: bookingStatusCount.rejected,
      color: "#ef4444",
    },
    {
      name: "Cancel Req",
      value: bookingStatusCount.cancellation_requested,
      color: "#3b82f6",
    },
    {
      name: "Cancelled",
      value: bookingStatusCount.cancelled,
      color: "#64748b",
    },
    {
      name: "Cancel Rejected",
      value: bookingStatusCount.cancellation_rejected,
      color: "#8b5cf6",
    },
  ].filter((item) => item.value > 0);

  const userRoleData = Object.entries(
    users.reduce(
      (acc, user) => {
        const role = String(user.role || "unknown").toLowerCase();
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([role, count]) => ({
    role: role.charAt(0).toUpperCase() + role.slice(1),
    count,
  }));

  const platformVolumeData = [
    { name: "Properties", value: stats.totalProperties },
    { name: "Users", value: stats.totalUsers },
    { name: "Bookings", value: stats.totalBookings },
    { name: "Pending", value: stats.pendingBookings },
  ];

  const totalEarnings = bookings.reduce((sum, booking) => {
    const paymentStatus = String(booking?.payment?.status || "").toUpperCase();
    const amount = Number(booking?.payment?.amount || 0);

    if (
      paymentStatus !== "SUCCESS" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return sum;
    }

    return sum + amount;
  }, 0);

  const formattedTotalEarnings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(totalEarnings);

  return (
    <div className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Platform overview and management
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-8 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error loading data
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-12">
          <Card className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Properties
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : stats.totalProperties}
                </p>
              </div>
              <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : stats.totalBookings}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Pending Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "-" : stats.pendingBookings}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white break-all">
                  {loading ? "-" : formattedTotalEarnings}
                </p>
              </div>
              <CircleDollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white dark:bg-slate-800 xl:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Platform Volume
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformVolumeData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              User Roles
            </h2>
            {userRoleData.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No user role data available.
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userRoleData} layout="vertical">
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="role" width={90} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#14b8a6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 bg-white dark:bg-slate-800 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Booking Status Distribution
          </h2>
          {bookingStatusData.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No bookings found to visualize.
            </p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                  >
                    {bookingStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Management Sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin-dashboard/all-properties">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    All Properties
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  View and manage all properties in the system
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  View All
                </Button>
              </Card>
            </Link>

            <Link href="/admin-dashboard/all-users">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    All Users
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Manage user accounts and permissions
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  Manage Users
                </Button>
              </Card>
            </Link>

            <Link href="/admin-dashboard/all-bookings">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    All Bookings
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Monitor and manage booking requests
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  View Bookings
                </Button>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
