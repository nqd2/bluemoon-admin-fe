import { Suspense } from "react";
import { getApartmentById } from "@/action/apartment-action";
import ApartmentDetailView from "./page-view";
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
          <Link href="/apartments">Quay lại danh sách</Link>
        </Button>
      </div>
    </div>
  );
}

async function ApartmentDetailContent({ id }: { id: string }) {
  const result = await getApartmentById(id);

  if (!result.success || !result.data) {
    return <ErrorState message={result.message || "Không tìm thấy căn hộ"} />;
  }

  return <ApartmentDetailView apartment={result.data} />;
}

export default async function ApartmentDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingState />}>
      <ApartmentDetailContent id={params.id} />
    </Suspense>
  );
}
