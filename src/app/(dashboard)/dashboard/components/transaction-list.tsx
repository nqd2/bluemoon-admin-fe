"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
  id: string;
  apartmentName?: string;
  apartmentId?: string;
  feeTitle?: string;
  feeId?: string;
  totalAmount: number;
  payerName?: string;
  status: string;
  createdAt: string;
}

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

const TransactionList = ({ title, transactions = [] }: TransactionListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "thành công":
        return "success";
      case "pending":
      case "chờ xử lý":
        return "warning";
      case "failed":
      case "thất bại":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader className="border-none mb-0 p-6">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-4 p-6 pt-0">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0 border-default-100"
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-sm text-default-900">
                      {item.apartmentName || item.apartmentId || "N/A"}
                    </div>
                    <div className="text-xs text-default-500">
                      {item.feeTitle || "N/A"}
                    </div>
                    <div className="text-xs text-default-500">
                      Người nộp: {item.payerName || "N/A"}
                    </div>
                    <div className="text-xs text-default-400">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge color={getStatusColor(item.status)} variant="soft">
                      {formatVND(item.totalAmount)}
                    </Badge>
                    <div className="text-xs text-default-400 mt-1 capitalize">
                       {item.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-default-500">Không có dữ liệu</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionList;

