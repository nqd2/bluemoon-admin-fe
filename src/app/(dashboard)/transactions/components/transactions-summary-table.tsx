"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Loader2, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransactionDetailDialog from "./transactions-detail-dialog";
import type { TransactionSummary, ApartmentTransactionRecord } from "../types";

const TransactionsSummaryTable = () => {
  const [data, setData] = React.useState<TransactionSummary[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = React.useState<
    Record<string, ApartmentTransactionRecord[]>
  >({});
  const [detailsLoading, setDetailsLoading] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions/apartments-summary");
      if (!res.ok) throw new Error("Failed to load summaries");
      const json = await res.json();
      const summaries: TransactionSummary[] = json.data || [];
      setData(summaries);

      if (summaries.length) {
        setDetailsLoading(true);
        try {
          const results = await Promise.all(
            summaries.map(async (item) => {
              const r = await fetch(
                `/api/transactions/apartment/${item.apartmentId}`
              );
              if (!r.ok) {
                return { id: item.apartmentId, records: [] as ApartmentTransactionRecord[] };
              }
              const j = await r.json();
              return {
                id: item.apartmentId,
                records: (j.data || []) as ApartmentTransactionRecord[],
              };
            })
          );

          const map: Record<string, ApartmentTransactionRecord[]> = {};
          results.forEach((r) => {
            map[r.id] = r.records;
          });
          setDetails(map);
        } catch (e) {
          console.error("Preload apartment transactions error:", e);
        } finally {
          setDetailsLoading(false);
        }
      }
    } catch (error) {
      console.error("Load transaction summaries error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportExcel = async () => {
    try {
      const res = await fetch("/api/export/transactions");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tong_hop_khoan_thu_can_ho.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export transactions excel error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách căn hộ & tổng khoản thu</CardTitle>
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4 mr-1" />
              Xuất Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[420px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-default-100">
                <TableHead>Căn hộ</TableHead>
                <TableHead>Tòa</TableHead>
                <TableHead>Chủ hộ</TableHead>
                <TableHead>Số giao dịch</TableHead>
                <TableHead className="text-right">Tổng thu</TableHead>
                <TableHead className="text-right">Xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-default-500">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {data.map((item) => (
                <TableRow key={item.apartmentId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.building}</TableCell>
                  <TableCell>{item.ownerName || "N/A"}</TableCell>
                  <TableCell>{item.transactionCount}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.totalCollected)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedId(item.apartmentId);
                        setOpen(true);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      <TransactionDetailDialog
        open={open}
        onOpenChange={setOpen}
        apartmentId={selectedId || ""}
        records={selectedId ? details[selectedId] || [] : []}
        loading={
          !!selectedId &&
          (detailsLoading || (!details[selectedId] && loading))
        }
      />
    </Card>
  );
};

export default TransactionsSummaryTable;

