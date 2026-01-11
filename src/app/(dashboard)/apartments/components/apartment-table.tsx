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
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Apartment } from "../types";
import type { Resident } from "@/app/(dashboard)/residents/types";
import { getResidentById } from "@/action/resident-action";

interface ApartmentTableProps {
  apartments: Apartment[];
}

export default function ApartmentTable({ apartments }: ApartmentTableProps) {
  if (apartments.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">
        <p className="text-lg">Không có dữ liệu căn hộ</p>
        <p className="text-sm mt-2">Hãy thêm căn hộ mới để bắt đầu quản lý</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-default-100">
          <TableHead>Số phòng</TableHead>
          <TableHead>Tòa nhà</TableHead>
          <TableHead>Tên hộ (Chủ hộ)</TableHead>
          <TableHead>Diện tích (m²)</TableHead>
          <TableHead>Số thành viên</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments.map((apt) => (
          <TableRow key={apt._id}>
            <TableCell className="font-medium">{apt.apartmentNumber}</TableCell>
            <TableCell>
              <Badge variant="soft">{apt.building}</Badge>
            </TableCell>
            <TableCell>{apt.ownerName || "-"}</TableCell> 
            <TableCell>{apt.area.toFixed(2)} m²</TableCell>
            <TableCell>{apt.members?.length || 0}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/apartments/${apt._id}`}>
                  <MoreVertical className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
