import { Suspense } from "react";
import TransactionPageView from "./page-view";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-default-500">Đang tải...</p>
      </div>
    </div>
  );
}

export default async function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TransactionPageView />
    </Suspense>
  );
}

