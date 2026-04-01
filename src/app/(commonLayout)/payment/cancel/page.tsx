import { PaymentCancelContent } from "@/components/PaymentCancelContent";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-0 shadow-xl">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-orange-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
