"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, DollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FeeTable from "./components/fee-table";
import FeeFormDialog from "./components/fee-form-dialog";
import FeePagination from "./components/fee-pagination";
import type { Fee, FeeListResponse } from "./types";

interface FeePageViewProps {
  initialFees?: Fee[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialType?: "Service" | "Contribution";
}

export default function FeePageView({
  initialFees = [],
  initialPagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  initialType,
}: FeePageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "Service" | "Contribution">(
    initialType || "all"
  );

  const fees = initialFees;
  const pagination = initialPagination;

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "Service" || typeParam === "Contribution") {
      setActiveTab(typeParam);
    } else {
      setActiveTab("all");
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const tabValue = value as "all" | "Service" | "Contribution";
    setActiveTab(tabValue);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (tabValue === "all") {
        params.delete("type");
      } else {
        params.set("type", tabValue);
      }
      params.set("page", "1");
      router.push(`/fees?${params.toString()}`);
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
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-default-900">Quản lý Khoản thu</h1>
            <p className="text-sm text-default-500">
              Tổng số: {pagination.total} khoản thu
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Khoản thu
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Danh sách Khoản thu</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="Service">Phí dịch vụ</TabsTrigger>
              <TabsTrigger value="Contribution">Phí đóng góp</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-4">
                {isPending && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                )}
                <FeeTable fees={fees} />
                <FeePagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  limit={pagination.limit}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FeeFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

