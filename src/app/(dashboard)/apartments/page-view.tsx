"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Building } from "lucide-react";
import ApartmentTable from "./components/apartment-table";
import ApartmentFormDialog from "./components/apartment-form-dialog";
import ApartmentPagination from "./components/apartment-pagination";
import type { ApartmentListResponse } from "./types";

interface ApartmentPageViewProps {
  initialData?: ApartmentListResponse;
  searchKeyword?: string;
  currentPage?: number;
  limit?: number;
}

export default function ApartmentPageView({
  initialData,
  searchKeyword = "",
  currentPage = 1,
  limit = 10,
}: ApartmentPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchKeyword);

  const apartments = initialData?.data || [];
  const pagination = { 
    page: initialData?.pagination?.page || 1, 
    limit: limit, 
    total: initialData?.pagination?.total || 0, 
    totalPages: initialData?.pagination?.totalPages || 1 
  };

  useEffect(() => {
    setSearchTerm(searchKeyword);
  }, [searchKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("keyword", searchTerm.trim());
      } else {
        params.delete("keyword");
      }
      params.set("page", "1");
      router.push(`/apartments?${params.toString()}`);
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-default-900">Quản lý Căn hộ</h1>
            <p className="text-sm text-default-500">Tổng số: {pagination.total} căn hộ</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Tạo Hộ khẩu
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Tìm theo tên chủ hộ, số phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Tìm kiếm</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <ApartmentTable apartments={apartments} />
          <ApartmentPagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            limit={pagination.limit}
          />
        </CardContent>
      </Card>

      <ApartmentFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
