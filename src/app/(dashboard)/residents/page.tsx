import { Suspense } from "react";
import { getResidents } from "@/action/resident-action";
import ResidentPageView from "./page-view";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

// Loading component
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

async function ResidentContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const keyword = typeof searchParams.keyword === "string" ? searchParams.keyword : "";
  const limit = typeof searchParams.limit === "string" ? parseInt(searchParams.limit) : 10;

  const result = await getResidents({
    page,
    limit,
    keyword,
  });

  return (
    <ResidentPageView
      initialData={result.data}
      searchKeyword={keyword}
      currentPage={page}
      limit={limit}
    />
  );
}

export default async function ResidentsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={<LoadingState />}>
      <ResidentContent searchParams={searchParams} />
    </Suspense>
  );
}
