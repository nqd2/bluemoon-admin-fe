"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeePaginationProps {
  currentPage: number;
  totalPages: number;
  limit?: number;
}

export default function FeePagination({
  currentPage,
  totalPages,
  limit = 10,
}: FeePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/fees?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageUrl(page));
  };

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1");
    router.push(`/fees?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (totalPages > 1) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-4 gap-4">
      <div className="flex items-center gap-6">
        <div className="text-sm text-default-500">
          Trang {currentPage} / {totalPages || 1}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-default-500">Hiển thị</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={createPageUrl(currentPage - 1)}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={createPageUrl(page)}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={createPageUrl(currentPage + 1)}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

