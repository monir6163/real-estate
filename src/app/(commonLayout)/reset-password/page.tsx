import { ResetPasswordForm } from "@/components/modules/authentication/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 bg-muted/40">
          <p className="text-sm text-muted-foreground">Loading reset form...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
