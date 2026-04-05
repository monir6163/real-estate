"use client";

import { resendVerificationEmail } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "input" | "loading" | "success" | "error"
  >(email ? "input" : "error");
  const [error, setError] = useState<string | null>(
    email ? null : "No email provided. Please register first.",
  );
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is missing. Please register again.");
      setStatus("error");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      setStatus("loading");

      const response = await fetch(`${API_URL}/api/v1/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify email");
      }

      setStatus("success");
      toast.success("Email verified successfully!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      // Keep user on OTP input so they can retry after an invalid code.
      setStatus("input");
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify email";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Email is missing.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await resendVerificationEmail(email);

      if (!response.status) {
        throw new Error(response.message || "Failed to resend OTP");
      }

      toast.success(response.message || "OTP sent to your email");
      setResendTimer(60);
      setOtp("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-primary/5">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SP</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              SmartProperty
            </span>
          </Link>
        </div>

        {/* Status Card */}
        <Card className="border-2">
          <CardContent className="pt-6">
            {status === "input" && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      Verify Your Email
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      We've sent a 6-digit code to
                    </p>
                    <p className="text-sm font-semibold text-foreground break-all">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Enter OTP Code
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      if (error) setError(null);
                    }}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-bold text-foreground"
                    disabled={isLoading}
                    autoFocus
                  />
                  {error && (
                    <div className="w-full bg-destructive/5 border border-destructive/20 rounded-md p-3">
                      <p className="text-xs text-destructive text-center">
                        {error}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || isLoading}
                  >
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend OTP"}
                  </Button>
                </div>
              </form>
            )}

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
                    <br />✓ You'll be redirected to login in 3 seconds
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
                    Verification Error
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    We couldn't verify your email address.
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
                        {error || "Failed to verify email"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/register">
                      <Mail className="mr-2 w-4 h-4" />
                      Register Again
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
