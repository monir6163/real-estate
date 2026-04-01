"use client";

import { getAllUsers, updateUserStatus } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/constants/Roles";
import { UserStatus, UserStatusColors } from "@/constants/UserStatus";
import { getErrorMessage } from "@/lib/error-message";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Loader2,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllUsers();

      if (result.status) {
        const usersData = Array.isArray(result.data)
          ? result.data
          : result.data?.data
            ? Array.isArray(result.data.data)
              ? result.data.data
              : [result.data.data]
            : [];
        setUsers(usersData);
        setFilteredUsers(usersData);
      } else {
        setError(result.message || "Could not load users right now.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Could not load users right now."));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      setUpdatingUserId(userId);
      const result = await updateUserStatus(userId, newStatus);

      if (result.status) {
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u,
          ),
        );
        toast.success(result.message || "User status updated successfully");
        // Refetch users to get fresh data
        await fetchUsers();
      } else {
        toast.error(
          result.message || "Could not update user status. Please try again.",
        );
      }
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Could not update user status. Please try again."),
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filterRole !== "ALL") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "AGENT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "USER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const roles = ["ALL", ...new Set(users.map((u) => u.role))];

  return (
    <div className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin-dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            All Users
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage user accounts and permissions
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white dark:bg-slate-800">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
            />
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "ALL" ? "All Roles" : role}
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Users Table/List */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-800">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || filterRole !== "ALL"
                ? "Try adjusting your filters"
                : "No users available"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="p-6 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.phone}
                          </p>
                        </div>
                      )}
                    </div>

                    {user.createdAt && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-2">
                    {/* Status Badge */}
                    <Badge
                      className={
                        UserStatusColors[
                          (user.status as keyof typeof UserStatusColors) ||
                            UserStatus.INACTIVE
                        ]
                      }
                    >
                      {user.status || UserStatus.INACTIVE}
                    </Badge>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {user.status === UserStatus.ACTIVE ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusUpdate(user.id, UserStatus.INACTIVE)
                          }
                          disabled={
                            updatingUserId === user.id ||
                            user.role === ROLES.ADMIN
                          }
                          title={
                            user.role === ROLES.ADMIN
                              ? "Admin users cannot be deactivated"
                              : ""
                          }
                        >
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1" />
                              Deactivate
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(user.id, UserStatus.ACTIVE)
                          }
                          disabled={updatingUserId === user.id}
                          className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200 border-green-200 dark:border-green-800 hover:bg-green-100"
                        >
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Total Count */}
        {!loading && (
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            <p>
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
