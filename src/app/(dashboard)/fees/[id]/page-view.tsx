"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";
import type { Fee, ApartmentStatus } from "../types";

interface FeeStatusViewProps {
  feeInfo: Fee;
  apartments: ApartmentStatus[];
}

// Format currency helper
function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Format date helper
function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function FeeStatusView({ feeInfo, apartments }: FeeStatusViewProps) {
  const totalPaid = apartments
    .filter((apt) => apt.status === "PAID" && apt.paidAmount)
    .reduce((sum, apt) => sum + (apt.paidAmount || 0), 0);

  const paidCount = apartments.filter((apt) => apt.status === "PAID").length;
  const unpaidCount = apartments.filter((apt) => apt.status === "UNPAID").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/fees">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-default-900">{feeInfo.title}</h1>
            <p className="text-sm text-default-500">
              Đơn giá: {formatVND(feeInfo.amount)} / {feeInfo.unit}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng đã thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success">{formatVND(totalPaid)}</div>
          <p className="text-sm text-default-500 mt-2">
            {paidCount} căn hộ đã đóng / {unpaidCount} căn hộ chưa đóng
          </p>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {apartments.length === 0 ? (
            <div className="text-center py-12 text-default-500">
              <p className="text-lg">Không có dữ liệu căn hộ</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-default-100">
                  <TableHead>Căn hộ</TableHead>
                  <TableHead>Chủ hộ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số tiền đã đóng</TableHead>
                  <TableHead>Ngày đóng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartments.map((apt) => (
                  <TableRow key={apt.apartmentId}>
                    <TableCell className="font-medium">{apt.apartmentName}</TableCell>
                    <TableCell>{apt.ownerName}</TableCell>
                    <TableCell>
                      {apt.status === "PAID" ? (
                        <Badge color="success">Đã đóng</Badge>
                      ) : (
                        <Badge color="default">Chưa đóng</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {apt.paidAmount ? formatVND(apt.paidAmount) : "-"}
                    </TableCell>
                    <TableCell>{formatDate(apt.paidDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

