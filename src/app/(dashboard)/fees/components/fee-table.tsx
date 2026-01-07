"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Link from "next/link";
import type { Fee } from "../types";

interface FeeTableProps {
  fees: Fee[];
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function FeeTable({ fees }: FeeTableProps) {
  if (fees.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">
        <p className="text-lg">Không có dữ liệu khoản thu</p>
        <p className="text-sm mt-2">Hãy thêm khoản thu mới để bắt đầu quản lý</p>
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    if (type === "Service") {
      return <Badge color="info">Phí dịch vụ</Badge>;
    }
    if (type === "Contribution") {
      return <Badge color="warning">Phí đóng góp</Badge>;
    }
    return <Badge color="default">{type}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-default-100">
          <TableHead>Tên khoản thu</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Đơn giá</TableHead>
          <TableHead>Đơn vị</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fees.map((fee) => (
          <TableRow key={fee._id}>
            <TableCell className="font-medium">{fee.title}</TableCell>
            <TableCell>{getTypeBadge(fee.type)}</TableCell>
            <TableCell>{formatVND(fee.amount)}</TableCell>
            <TableCell>
              <Badge variant="soft">{fee.unit}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/fees/${fee._id}`}>
                  <Eye className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

