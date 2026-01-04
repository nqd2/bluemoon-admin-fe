"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Home } from "lucide-react";
import MembersTable from "../components/members-table";
import AddMemberDialog from "../components/add-member-dialog";
import type { Apartment } from "../types";
import { Badge } from "@/components/ui/badge";

interface ApartmentDetailViewProps {
  apartment: Apartment;
}

export default function ApartmentDetailView({ apartment }: ApartmentDetailViewProps) {
  const router = useRouter();
  const [openAddMember, setOpenAddMember] = useState(false);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Thông tin căn hộ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tên hộ</span>
              <span className="font-medium">{apartment.ownerName || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Số phòng</span>
              <span className="font-medium">{apartment.apartmentNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tòa nhà</span>
              <Badge variant="outline">{apartment.building}</Badge>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Diện tích</span>
              <span className="font-medium">{apartment.area} m²</span>
            </div>
            <div className="pt-2">
              <span className="text-muted-foreground block mb-1">Mô tả</span>
              <p className="text-sm text-default-700">{apartment.description || "Không có mô tả"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Danh sách thành viên</CardTitle>
            <Button size="sm" onClick={() => setOpenAddMember(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm thành viên
            </Button>
          </CardHeader>
          <CardContent>
            <MembersTable members={apartment.members} />
          </CardContent>
        </Card>
      </div>

      <AddMemberDialog
        open={openAddMember}
        onOpenChange={setOpenAddMember}
        apartmentId={apartment._id}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
