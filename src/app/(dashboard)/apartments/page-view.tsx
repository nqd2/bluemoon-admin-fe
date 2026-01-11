"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Building, Download } from "lucide-react";
import ApartmentTable from "./components/apartment-table";
import ApartmentFormDialog from "./components/apartment-form-dialog";
import ApartmentPagination from "./components/apartment-pagination";
import type { ApartmentListResponse } from "./types";

interface ApartmentPageViewProps {
  initialData?: ApartmentListResponse;
  buildingFilter?: string;
  currentPage?: number;
  limit?: number;
}

export default function ApartmentPageView({
  initialData,
  buildingFilter = "",
  currentPage = 1,
  limit = 10,
}: ApartmentPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [building, setBuilding] = useState(buildingFilter);

  const apartments = initialData?.data || [];
  const pagination = { 
    page: initialData?.page || 1, 
    limit: limit, 
    total: initialData?.total || 0, 
    totalPages: initialData?.totalPages || 1 
  };

  useEffect(() => {
    setBuilding(buildingFilter);
  }, [buildingFilter]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (building.trim()) {
        params.set("building", building.trim());
      } else {
        params.delete("building");
      }
      params.set("page", "1");
      router.push(`/apartments?${params.toString()}`);
    });
  };

  const handleClearFilter = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("building");
      params.set("page", "1");
      router.push(`/apartments?${params.toString()}`);
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleExportExcel = async () => {
    try {
      const res = await fetch("/api/export/apartments");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "danh_sach_can_ho.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export apartments excel error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6">
      <CardHeader className="pb-4">
          <div className="flex flex-col max-[500px]:gap-4 gap-0 items-start justify-between max-[500px]:items-stretch">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-default-900">Quản lý Căn hộ</h1>
              <p className="text-sm text-default-500">Tổng số: {pagination.total} căn hộ</p>
            </div>
          </div>
          <div className="flex items-center gap-2 max-[500px]:flex-col max-[500px]:w-full">
            <Button
              variant="outline"
              type="button"
              onClick={handleExportExcel}
              className="max-[500px]:w-full"
            >
              <Download className="h-4 w-4 mr-2" /> Xuất Excel
            </Button>
            <Button onClick={() => setIsCreateOpen(true)} className="max-[500px]:w-full">
              <Plus className="h-4 w-4 mr-2" /> Tạo Hộ khẩu
            </Button>
          </div>
        </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lọc theo Tòa nhà</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFilter} className="flex gap-3">
            <Input
              placeholder="Nhập mã tòa nhà (ví dụ: A, B, C)..."
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Lọc</span>
            </Button>
            {building && (
              <Button type="button" variant="outline" onClick={handleClearFilter} disabled={isPending}>
                Xóa bộ lọc
              </Button>
            )}
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
