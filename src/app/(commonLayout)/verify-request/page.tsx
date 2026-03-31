import { VerifyRequest } from "@/components/modules/authentication/VerifyRequest";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Request",
  description: "Check your email for the verification link.",
};

export default function VerifyRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      }
    >
      <VerifyRequest />
    </Suspense>
  );
}
