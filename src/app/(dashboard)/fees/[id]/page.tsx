import { Suspense } from "react";
import { getFeeStatus } from "@/action/fee-action";
import FeeStatusView from "./page-view";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-6">
      <Alert variant="soft" color="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button asChild variant="outline">
          <Link href="/fees">Quay lại danh sách</Link>
        </Button>
      </div>
    </div>
  );
}

async function FeeStatusContent({ id }: { id: string }) {
  const result = await getFeeStatus(id);

  if (!result.success || !result.data) {
    return <ErrorState message={result.message || "Không thể tải tình trạng khoản thu"} />;
  }

  return <FeeStatusView feeInfo={result.data.feeInfo} apartments={result.data.apartments} />;
}

export default async function FeeStatusPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingState />}>
      <FeeStatusContent id={params.id} />
    </Suspense>
  );
}

