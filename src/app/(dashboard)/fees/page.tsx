import { Suspense } from "react";
import { getFees } from "@/action/fee-action";
import FeePageView from "./page-view";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-default-500">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}

async function FeeContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;
  const type = typeof searchParams.type === "string" 
    ? (searchParams.type === "Service" || searchParams.type === "Contribution" 
      ? searchParams.type 
      : undefined)
    : undefined;

  const result = await getFees({ page, limit, type });

  return (
    <FeePageView
      initialFees={result.data || []}
      initialPagination={result.pagination}
      initialType={type}
    />
  );
}

export default async function FeesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={<LoadingState />}>
      <FeeContent searchParams={searchParams} />
    </Suspense>
  );
}

