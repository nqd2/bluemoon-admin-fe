"use client";

import React, { useState, useEffect } from "react";
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ResidentFormDialog from "./resident-form-dialog";
import { deleteResident } from "@/action/resident-action";
import type { Resident } from "../types";

interface ResidentTableProps {
  residents: Resident[];
  onRefresh?: () => void;
}

export default function ResidentTable({ residents, onRefresh }: ResidentTableProps) {
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingResidentId, setDeletingResidentId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status?: string) => {
    if (!status) {
      return <Badge color="default">Chưa xác định</Badge>;
    }

    const normalizedStatus = status.trim();
    
    if (normalizedStatus === "Thường trú") {
      return <Badge color="success">Thường trú</Badge>;
    }
    if (normalizedStatus === "Tạm trú") {
      return <Badge color="warning">Tạm trú</Badge>;
    }
    if (normalizedStatus === "Tạm vắng") {
      return <Badge color="secondary">Tạm vắng</Badge>;
    }
    
    return <Badge color="default">{normalizedStatus}</Badge>;
  };

  const getGenderBadge = (gender?: string) => {
    switch (gender) {
      case "Nam":
        return <Badge variant="soft" color="info">{gender}</Badge>;
      case "Nữ":
        return <Badge variant="soft" color="destructive">{gender}</Badge>;
      default:
        return <Badge variant="soft" color="default">{gender || "-"}</Badge>;
    }
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingResidentId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingResidentId) return;

    try {
      const result = await deleteResident(deletingResidentId);
      if (result.success) {
        toast.success("Xóa cư dân thành công");
        onRefresh?.();
      } else {
        toast.error(result.message || "Không thể xóa cư dân");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingResident(null);
    onRefresh?.();
  };

  if (residents.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">
        <p className="text-lg">Không có dữ liệu cư dân</p>
        <p className="text-sm mt-2">Hãy thêm cư dân mới để bắt đầu quản lý</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-default-100">
            <TableHead>Họ tên</TableHead>
            {/* <TableHead>CCCD/CMND</TableHead> */}
            <TableHead>Giới tính</TableHead>
            <TableHead>Ngày sinh</TableHead>
            {/* <TableHead>Nghề nghiệp</TableHead> */}
            <TableHead>Căn hộ</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident._id}>
              <TableCell className="font-medium">{resident.fullName}</TableCell>
              {/* <TableCell>{resident.identityCard}</TableCell> */}
              <TableCell>{getGenderBadge(resident.gender)}</TableCell>
              <TableCell>{formatDate(resident.dob)}</TableCell>
              {/* <TableCell>{resident.job || "-"}</TableCell> */}
              <TableCell>
                {resident.apartmentId 
                  ? `${resident.apartmentId.building} - ${resident.apartmentId.apartmentNumber}`
                  : "-"}
              </TableCell>
              <TableCell>{resident.roleInApartment || "-"}</TableCell>
              <TableCell>{getStatusBadge(resident.residencyStatus)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(resident)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(resident._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <ResidentFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        resident={editingResident}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingResidentId(null);
        }}
        onConfirm={confirmDelete}
        defaultToast={false}
        toastMessage="Xóa cư dân thành công"
      />
    </>
  );
}
