import { Suspense } from "react";
import { getApartments } from "@/action/apartment-action";
import ApartmentPageView from "./page-view";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

async function ApartmentContent({ searchParams }: { searchParams: SearchParams }) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const keyword = typeof searchParams.keyword === "string" ? searchParams.keyword : "";
  const limit = 10;

  const result = await getApartments({ page, limit, keyword });

  return (
    <ApartmentPageView
      initialData={result.data}
      searchKeyword={keyword}
      currentPage={page}
    />
  );
}

export default async function ApartmentsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  return (
    <Suspense fallback={<LoadingState />}>
      <ApartmentContent searchParams={searchParams} />
    </Suspense>
  );
}
