import { PaymentSuccessContent } from "@/components/PaymentSuccessContent";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-0 shadow-xl">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="animate-spin">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
