"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function VerifyRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  useEffect(() => {
    // Auto-redirect to OTP verification page after 2 seconds
    const timer = setTimeout(() => {
      if (email) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [email, router]);

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

        {/* Content Card */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              {/* Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-background">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground">
                  Account Created Successfully!
                </h1>
                <p className="text-muted-foreground text-sm max-w-sm">
                  We've sent a verification code to
                </p>
                {email && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground break-all">
                      {email}
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="w-full space-y-4">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3 text-left">
                    <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-1">
                        What's Next?
                      </p>
                      <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                        <li>Check your inbox for our 6-digit OTP code</li>
                        <li>Enter the code on the next page</li>
                        <li>Your account will be activated instantly</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3 text-left">
                    <Mail className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-400 mb-1">
                        Check Your Email
                      </p>
                      <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        Look for an email from us containing your 6-digit
                        verification code. Don't forget to check spam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-redirect message */}
              <div className="w-full bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-700 dark:text-green-400">
                  ✓ Redirecting to verification page...
                </p>
              </div>

              {/* Actions */}
              <div className="w-full space-y-3 pt-4">
                <Button asChild className="w-full" size="lg">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(email || "")}`}
                  >
                    Enter Verification Code
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full" size="lg">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
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
