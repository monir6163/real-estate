"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types";
import {
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Shield,
  XCircle,
} from "lucide-react";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>Your account information at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar size="lg" className="h-24 w-24">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className="capitalize"
              >
                {user.role}
              </Badge>
              <Badge
                variant={user.status === "active" ? "default" : "destructive"}
                className="capitalize"
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              {user.emailVerified ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Account Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Account Details
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role} Account
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Verification Status */}
        <div
          className={`rounded-lg p-4 ${
            user.emailVerified
              ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
              : "bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800"
          }`}
        >
          <div className="flex items-start gap-3">
            {user.emailVerified ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {user.emailVerified ? "Email Verified" : "Email Not Verified"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {user.emailVerified
                  ? "Your email address has been verified"
                  : "Please verify your email address to access all features"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
