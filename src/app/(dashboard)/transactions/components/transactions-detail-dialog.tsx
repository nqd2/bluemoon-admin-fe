"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { ApartmentTransactionRecord } from "../types";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentId: string;
  records: ApartmentTransactionRecord[];
  loading?: boolean;
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const formatDate = (date?: string) => {
  if (!date) return "-";
  try {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return date;
  }
};

export default function TransactionDetailDialog({
  open,
  onOpenChange,
  apartmentId,
  records,
  loading = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCreateForApartment = () => {
    if (!apartmentId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("apartmentId", apartmentId);
    router.push(`/transactions?${params.toString()}`);
    onOpenChange(false);
  };

  const mapFeeType = (type: string) => {
    switch (type) {
      case "Contribution":
        return "Đóng góp";
      case "Service":
        return "Dịch vụ";
      case "Utility":
        return "Phí sử dụng";
    }
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case "pending":
      case "Pending":
      case "Chờ thanh toán":
        return "Chờ thanh toán";
      case "Completed":
      case "Thành công":
        return "Đã thanh toán";
      case "Failed":
      case "Thất bại":
        return "Thất bại";
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Chi tiết khoản thu của căn hộ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-default-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : (
            <ScrollArea className="max-h-[520px] w-full">
              <Table className="min-w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-default-100">
                    <TableHead>Khoản thu</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Người nộp</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-default-500">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.feeId.title}</TableCell>
                        <TableCell>{mapFeeType(item.feeId.type)}</TableCell>
                        <TableCell>{formatVND(item.totalAmount)}</TableCell>
                        <TableCell>
                          {item.unitPrice
                            ? formatVND(item.unitPrice)
                            : "-"}
                        </TableCell>
                        <TableCell>{item.usage ?? "-"}</TableCell>
                        <TableCell>{item.payerName || "N/A"}</TableCell>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell className="capitalize">{mapStatus(item.status || "completed")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateForApartment}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Ghi nhận khoản thu cho căn hộ này
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

