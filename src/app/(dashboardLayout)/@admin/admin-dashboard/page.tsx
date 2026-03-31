"use client";

import { getAllBookings } from "@/actions/bookings";
import { getAllProperties } from "@/actions/properties";
import { getAllUsers } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, BarChart3, Calendar, Home, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
          (b: any) => b.status === "PENDING",
        ).length;

        setStats({
          totalProperties: Array.isArray(properties) ? properties.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalBookings: Array.isArray(bookings) ? bookings.length : 0,
          pendingBookings: pendingCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
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
        </div>

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
