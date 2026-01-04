"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Users } from "lucide-react";
import ResidentTable from "./components/resident-table";
import ResidentFormDialog from "./components/resident-form-dialog";
import ResidentPagination from "./components/resident-pagination";
import type { Resident, ResidentListResponse } from "./types";

interface ResidentPageViewProps {
  initialData?: ResidentListResponse;
  searchKeyword?: string;
  currentPage?: number;
  limit?: number;
}

export default function ResidentPageView({
  initialData,
  searchKeyword = "",
  currentPage = 1,
  limit = 10,
}: ResidentPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchKeyword);

  const residents = initialData?.residents || [];
  const pagination = {
    page: initialData?.page || 1,
    limit: limit,
    total: initialData?.total || 0,
    totalPages: initialData?.pages || 1,
  };

  // Update search term when URL changes
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
      params.set("page", "1"); // Reset to first page on search
      // limit is already preserving in searchParams or we can rely on prop
      // Using searchParams.toString() copies existing params including limit
      
      router.push(`/residents?${params.toString()}`);
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-default-900">Quản lý Cư dân</h1>
            <p className="text-sm text-default-500">
              Tổng số: {pagination.total} cư dân
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Cư dân
        </Button>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Tìm theo tên hoặc CCCD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Tìm kiếm</span>
            </Button>
            {searchKeyword && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("keyword");
                  params.set("page", "1");
                  router.push(`/residents?${params.toString()}`);
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Danh sách Cư dân</CardTitle>
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResidentTable residents={residents} onRefresh={handleRefresh} />
          <ResidentPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            limit={pagination.limit}
          />
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <ResidentFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
