"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fee } from "../../fees/types";
import { cn } from "@/lib/utils";

interface FeeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function FeeSelect({ value, onChange, error }: FeeSelectProps) {
  const [fees, setFees] = React.useState<Fee[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/fees?limit=1000");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFees(data.data.filter((fee: Fee) => fee.isActive !== false));
          }
        }
      } catch (error) {
        console.error("Error fetching fees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const selectedFee = fees.find((f) => f._id === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger
        className={cn(error && "border-destructive text-destructive")}
      >
        <SelectValue placeholder={loading ? "Đang tải..." : "Chọn khoản thu..."}>
          {selectedFee ? selectedFee.title : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
            Đang tải...
          </div>
        ) : fees.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có khoản thu nào
          </div>
        ) : (
          fees.map((fee) => (
            <SelectItem key={fee._id} value={fee._id}>
              {fee.title} ({new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(fee.amount)}/{fee.unit})
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

