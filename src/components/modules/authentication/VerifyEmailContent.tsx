"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Loader2,
  Mail,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [error, setError] = useState<string | null>(
    token ? null : "No verification token found.",
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      const { error } = await authClient.verifyEmail({
        query: { token },
      });

      if (error) {
        setStatus("error");
        setError(error.message || "Failed to verify email.");
        toast.error("Email verification failed.");
      } else {
        setStatus("success");
        toast.success("Email verified successfully!");
        // Optional: auto-redirect after delay
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-primary/5">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <span className="text-2xl font-bold text-foreground">FoodHub</span>
          </Link>
        </div>

        {/* Status Card */}
        <Card className="border-2">
          <CardContent className="pt-6">
            {status === "loading" && (
              <div className="flex flex-col items-center text-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    Verifying Your Email
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Please wait while we verify your email address. This should
                    only take a moment.
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center text-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    Email Verified!
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Your account has been successfully verified. You can now
                    access all features of FoodHub.
                  </p>
                </div>
                <div className="w-full bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    ✓ Account activated successfully
                    <br />✓ You'll be redirected to login in 5 seconds
                  </p>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href="/login">
                    Sign In Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center text-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-destructive/20">
                    <XCircle className="w-10 h-10 text-destructive" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    Verification Failed
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    We couldn't verify your email address. The link may be
                    expired or invalid.
                  </p>
                </div>
                <div className="w-full bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-destructive mb-1">
                        Error Details
                      </p>
                      <p className="text-xs text-destructive/80">
                        {error || "The verification link is no longer valid."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/register">
                      <Mail className="mr-2 w-4 h-4" />
                      Request New Verification Link
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                    size="lg"
                  >
                    <Link href="/">
                      <Home className="mr-2 w-4 h-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-xs text-muted-foreground">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@foodhub.com"
            className="text-primary hover:underline"
          >
            support@foodhub.com
          </a>
        </p>
      </div>
    </div>
  );
}
