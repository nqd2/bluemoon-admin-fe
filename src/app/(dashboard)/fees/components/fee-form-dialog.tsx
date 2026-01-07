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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createFee } from "@/action/fee-action";
import type { FeeType } from "../types";

interface FeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function FeeFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: FeeFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Service" as FeeType,
    amount: "",
    unit: "m2",
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tên khoản thu là bắt buộc";
    }
    if (!formData.amount) {
      newErrors.amount = "Đơn giá là bắt buộc";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Đơn giá phải là số dương";
    }
    if (!formData.unit.trim()) {
      newErrors.unit = "Đơn vị tính là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await createFee({
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        amount: Number(formData.amount),
        unit: formData.unit,
      });

      if (result.success) {
        toast.success(result.message || "Tạo khoản thu thành công");
        setFormData({
          title: "",
          description: "",
          type: "Service",
          amount: "",
          unit: "m2",
        });
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
          <DialogTitle>Tạo Khoản thu mới</DialogTitle>
          <DialogDescription>
            Điền thông tin khoản thu mới vào hệ thống quản lý.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên khoản thu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: Tiền điện T10"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) {
                  setErrors({ ...errors, title: "" });
                }
              }}
              color={errors.title ? "destructive" : undefined}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả về khoản thu..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Loại phí <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: FeeType) => {
                  setFormData({ ...formData, type: value });
                }}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại phí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service">Phí dịch vụ</SelectItem>
                  <SelectItem value="Contribution">Phí đóng góp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                Đơn vị tính <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => {
                  setFormData({ ...formData, unit: value });
                  if (errors.unit) {
                    setErrors({ ...errors, unit: "" });
                  }
                }}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m2">m²</SelectItem>
                  <SelectItem value="person">Người</SelectItem>
                  <SelectItem value="household">Hộ</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Đơn giá <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                if (errors.amount) {
                  setErrors({ ...errors, amount: "" });
                }
              }}
              color={errors.amount ? "destructive" : undefined}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
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

