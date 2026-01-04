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
import { Badge } from "@/components/ui/badge";
import type { ApartmentMember } from "../types";
import { Resident } from "@/app/(dashboard)/residents/types";

interface MembersTableProps {
  members: ApartmentMember[];
}

export default function MembersTable({ members }: MembersTableProps) {
  if (!members || members.length === 0) {
    return <div className="text-center py-4 text-default-500">Chưa có thành viên nào</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-default-100">
          <TableHead>Họ tên</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>CCCD/CMND</TableHead>
          <TableHead>Giới tính</TableHead>
          <TableHead>Ngày sinh</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((mem, index) => {
          // Resident có thể là string ID hoặc object populated. 
          // Cần handle type guard. Giả sử backend populate.
          const resident = typeof mem.resident === 'object' ? (mem.resident as Resident) : null;

          return (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {resident ? resident.fullName : "Đang tải / ID: " + mem.resident}
              </TableCell>
              <TableCell>
                <Badge variant="soft" color={mem.role === "Chủ hộ" ? "info" : "default"}>
                  {mem.role}
                </Badge>
              </TableCell>
              <TableCell>{resident?.identityCard || "-"}</TableCell>
              <TableCell>{resident?.gender || "-"}</TableCell>
              <TableCell>
                {resident?.dob ? new Date(resident.dob).toLocaleDateString("vi-VN") : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
