"use client";

import { forgotPassword } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error-message";
import { forgotPasswordSchema } from "@/schema/authSchema";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid email address");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      const result = await forgotPassword(email);

      if (!result.status) {
        throw new Error(result.message || "Failed to send reset OTP");
      }

      setSubmittedEmail(email);
      toast.success(result.message || "Reset OTP sent to your email", {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to send reset OTP. Please try again."),
        { id: toastId },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/40">
      <Card className="w-full max-w-md border-2">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset OTP code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset OTP"}
            </Button>
          </form>

          {submittedEmail && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-sm">
              OTP sent to{" "}
              <span className="font-semibold">{submittedEmail}</span>. Continue
              to reset your password.
              <Button asChild className="w-full mt-3">
                <Link
                  href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}
                >
                  Go to Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Need help? Contact{" "}
            <a
              href="mailto:support@smartproperty.com"
              className="text-primary hover:underline"
            >
              support@smartproperty.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
