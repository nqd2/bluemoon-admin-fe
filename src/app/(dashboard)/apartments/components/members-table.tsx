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
          <TableHead>Nghề nghiệp</TableHead>
          <TableHead>Giới tính</TableHead>
          <TableHead>Ngày sinh</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((mem, index) => {
          return (
            console.log("mem", mem),
            <TableRow key={index}>
              <TableCell className="font-medium">
                {mem.fullName || "-"}
              </TableCell>
              <TableCell>
                <Badge variant="soft" color={mem.roleInApartment === "Chủ hộ" ? "info" : "default"}>
                  {mem.roleInApartment}
                </Badge>
              </TableCell>
              {/* <TableCell>{resident?.identityCard || "-"}</TableCell> */}
              <TableCell>{mem.job || "-"}</TableCell>
              <TableCell>{mem.gender || "-"}</TableCell>
              <TableCell>
                {mem.dob ? new Date(mem.dob).toLocaleDateString("vi-VN") : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
