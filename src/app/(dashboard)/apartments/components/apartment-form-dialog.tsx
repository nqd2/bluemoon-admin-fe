"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createApartment } from "@/action/apartment-action";
import { ResidentSelect } from "./resident-select";

interface ApartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ApartmentFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: ApartmentFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    ownerId: "",
    name: "",
    apartmentNumber: "",
    building: "",
    area: "",
    description: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerId) newErrors.ownerId = "Chủ hộ là bắt buộc";
    if (!formData.name.trim()) newErrors.name = "Tên hộ là bắt buộc";
    if (!formData.apartmentNumber.trim()) newErrors.apartmentNumber = "Số phòng là bắt buộc";
    if (!formData.building.trim()) newErrors.building = "Tòa nhà là bắt buộc";
    if (!formData.area) {
      newErrors.area = "Diện tích là bắt buộc";
    } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      newErrors.area = "Diện tích phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await createApartment({
        ownerId: formData.ownerId,
        apartmentNumber: formData.apartmentNumber,
        building: formData.building,
        area: Number(formData.area),
        description: formData.description || undefined,
      });

      if (result.success) {
        toast.success(result.message || "Tạo căn hộ thành công");
        setFormData({ ownerId: "", name: "", apartmentNumber: "", building: "", area: "", description: "" });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Hộ khẩu / Căn hộ mới</DialogTitle>
          <DialogDescription>
            Điền thông tin căn hộ mới vào hệ thống quản lý.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Chủ hộ <span className="text-destructive">*</span></Label>
            <ResidentSelect
              value={formData.ownerId}
              onChange={(val) => {
                setFormData({ ...formData, ownerId: val });
                if (errors.ownerId) {
                  setErrors({ ...errors, ownerId: "" });
                }
              }}
              error={!!errors.ownerId}
            />
            {errors.ownerId && <p className="text-sm text-destructive">{errors.ownerId}</p>}
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apartmentNumber">Số phòng <span className="text-destructive">*</span></Label>
              <Input
                id="apartmentNumber"
                placeholder="101"
                value={formData.apartmentNumber}
                onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                color={errors.apartmentNumber ? "destructive" : undefined}
              />
              {errors.apartmentNumber && <p className="text-sm text-destructive">{errors.apartmentNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="building">Tòa nhà <span className="text-destructive">*</span></Label>
              <Input
                id="building"
                placeholder="A"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                color={errors.building ? "destructive" : undefined}
              />
              {errors.building && <p className="text-sm text-destructive">{errors.building}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Diện tích (m²) <span className="text-destructive">*</span></Label>
            <Input
              id="area"
              type="number"
              placeholder="70.5"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              color={errors.area ? "destructive" : undefined}
            />
            {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả thêm</Label>
            <Input
              id="description"
              placeholder="Ghi chú thêm về căn hộ..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo mới
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
