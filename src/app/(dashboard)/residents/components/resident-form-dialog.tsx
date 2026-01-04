"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createResident, updateResident } from "@/action/resident-action";
import type { Resident, CreateResidentPayload, UpdateResidentPayload } from "../types";
import type { Apartment } from "@/app/(dashboard)/apartments/types";

interface ResidentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident?: Resident | null; // If provided, means editing
  onSuccess?: () => void;
}

export default function ResidentFormDialog({
  open,
  onOpenChange,
  resident,
  onSuccess,
}: ResidentFormDialogProps) {
  const isEditing = !!resident;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loadingApartments, setLoadingApartments] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Nam",
    identityCard: "",
    hometown: "",
    job: "",
    residencyStatus: "",
    apartmentId: "",
  });

  useEffect(() => {
    const loadApartments = async () => {
      setLoadingApartments(true);
      try {
        const response = await fetch("/api/user/apartments");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setApartments(data.data);
          }
        }
      } catch (error) {
        console.error("Error loading apartments:", error);
      } finally {
        setLoadingApartments(false);
      }
    };

    if (open) {
      loadApartments();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (resident) {
        setFormData({
          fullName: resident.fullName || "",
          dob: resident.dob ? resident.dob.split("T")[0] : "",
          gender: resident.gender || "Nam",
          identityCard: resident.identityCard || "",
          hometown: resident.hometown || "",
          job: resident.job || "",
          residencyStatus: resident.residencyStatus || "Thường trú",
          apartmentId: resident.apartmentId?._id || "",
        });
      } else {
        setFormData({
          fullName: "",
          dob: "",
          gender: "Nam",
          identityCard: "",
          hometown: "",
          job: "",
          residencyStatus: "Thường trú",
          apartmentId: "",
        });
      }
      setErrors({});
    }
  }, [open, resident]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc";
    }

    if (!formData.dob) {
      newErrors.dob = "Ngày sinh là bắt buộc";
    }

    if (!formData.identityCard.trim()) {
      newErrors.identityCard = "CCCD/CMND là bắt buộc";
    } else if (!/^\d+$/.test(formData.identityCard)) {
      newErrors.identityCard = "CCCD/CMND chỉ được chứa số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;

      if (isEditing && resident) {
        const payload: UpdateResidentPayload = {
          fullName: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          identityCard: formData.identityCard,
          hometown: formData.hometown || undefined,
          job: formData.job || undefined,
          residencyStatus: formData.residencyStatus,
          apartmentId: formData.apartmentId || undefined,
        };
        result = await updateResident(resident._id, payload);
      } else {
        const payload: CreateResidentPayload = {
          fullName: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          identityCard: formData.identityCard,
          hometown: formData.hometown || undefined,
          job: formData.job || undefined,
          apartmentId: formData.apartmentId || undefined,
        } as any;
        result = await createResident(payload as CreateResidentPayload);
      }

      if (result.success) {
        toast.success(result.message || (isEditing ? "Cập nhật thành công" : "Thêm cư dân thành công"));
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Có lỗi xảy ra");
        if (result.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa thông tin cư dân" : "Thêm cư dân mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Chỉnh sửa thông tin cư dân trong hệ thống"
              : "Nhập thông tin cư dân mới vào hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nhập họ tên"
              color={errors.fullName ? "destructive" : undefined}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>

          {/* Ngày sinh */}
          <div className="space-y-2">
            <Label htmlFor="dob">
              Ngày sinh <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              color={errors.dob ? "destructive" : undefined}
            />
            {errors.dob && (
              <p className="text-sm text-destructive">{errors.dob}</p>
            )}
          </div>

          {/* Giới tính */}
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CCCD/CMND */}
          <div className="space-y-2">
            <Label htmlFor="identityCard">
              CCCD/CMND <span className="text-destructive">*</span>
            </Label>
            <Input
              id="identityCard"
              value={formData.identityCard}
              onChange={(e) => handleChange("identityCard", e.target.value)}
              placeholder="Nhập số CCCD/CMND"
              color={errors.identityCard ? "destructive" : undefined}
            />
            {errors.identityCard && (
              <p className="text-sm text-destructive">{errors.identityCard}</p>
            )}
          </div>

          {/* Quê quán */}
          <div className="space-y-2">
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              id="hometown"
              value={formData.hometown}
              onChange={(e) => handleChange("hometown", e.target.value)}
              placeholder="Nhập quê quán"
            />
          </div>

          {/* Nghề nghiệp */}
          <div className="space-y-2">
            <Label htmlFor="job">Nghề nghiệp</Label>
            <Input
              id="job"
              value={formData.job}
              onChange={(e) => handleChange("job", e.target.value)}
              placeholder="Nhập nghề nghiệp"
            />
          </div>

          {/* Căn hộ */}
          <div className="space-y-2">
            <Label htmlFor="apartmentId">Căn hộ</Label>
            <Select
              value={formData.apartmentId}
              onValueChange={(value) => handleChange("apartmentId", value)}
              disabled={loadingApartments}
            >
              <SelectTrigger id="apartmentId">
                <SelectValue placeholder={loadingApartments ? "Đang tải..." : "Chọn căn hộ"} />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="">Không có căn hộ</SelectItem>
                {apartments.map((apt) => (
                  <SelectItem key={apt._id} value={apt._id}>
                    {apt.building} - {apt.apartmentNumber} ({apt.ownerName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trạng thái - chỉ hiển thị khi edit */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.residencyStatus}
                onValueChange={(value) => handleChange("residencyStatus", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Thường trú">Thường trú</SelectItem>
                  <SelectItem value="Tạm trú">Tạm trú</SelectItem>
                  <SelectItem value="Tạm vắng">Tạm vắng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
