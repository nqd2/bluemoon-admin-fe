"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { addMemberToApartment } from "@/action/apartment-action";
import { ResidentSelect } from "./resident-select";

interface AddMemberDialogProps {
  apartmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddMemberDialog({
  apartmentId,
  open,
  onOpenChange,
  onSuccess,
}: AddMemberDialogProps) {
  const [loading, setLoading] = useState(false);
  const [residentId, setResidentId] = useState("");
  const [role, setRole] = useState<"Chủ hộ" | "Thành viên">("Thành viên");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentId) {
      setError("Vui lòng chọn cư dân");
      return;
    }

    setLoading(true);
    try {
      const result = await addMemberToApartment(apartmentId, { residentId, role });
      if (result.success) {
        toast.success(result.message || "Thêm thành viên thành công");
        setResidentId("");
        setRole("Thành viên");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Cư dân <span className="text-destructive">*</span></Label>
            <ResidentSelect
              value={residentId}
              onChange={(val) => {
                setResidentId(val);
                setError("");
              }}
              error={!!error}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Vai trò</Label>
            <Select
              value={role}
              onValueChange={(val: any) => setRole(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Thành viên">Thành viên</SelectItem>
                <SelectItem value="Chủ hộ">Chủ hộ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
