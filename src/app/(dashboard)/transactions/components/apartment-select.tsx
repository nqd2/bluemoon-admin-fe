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
import { Apartment } from "../../apartments/types";
import { cn } from "@/lib/utils";

interface ApartmentSelectProps {
  value: string;
  onChange: (value: string, apartmentInfo?: Apartment) => void;
  error?: boolean;
}

export default function ApartmentSelect({ value, onChange, error }: ApartmentSelectProps) {
  const [apartments, setApartments] = React.useState<Apartment[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchApartments = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/apartments");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setApartments(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const selectedApartment = apartments.find((a) => a._id === value);

  const handleChange = (newValue: string) => {
    const apartment = apartments.find((a) => a._id === newValue);
    onChange(newValue, apartment);
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger
        className={cn(error && "border-destructive text-destructive")}
      >
        <SelectValue placeholder={loading ? "Đang tải..." : "Chọn căn hộ..."}>
          {selectedApartment
            ? `${selectedApartment.apartmentNumber} - Tòa ${selectedApartment.building}${selectedApartment.ownerName ? ` (${selectedApartment.ownerName})` : ""}`
            : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
            Đang tải...
          </div>
        ) : apartments.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có căn hộ nào
          </div>
        ) : (
          apartments.map((apartment) => (
            <SelectItem key={apartment._id} value={apartment._id}>
              {apartment.apartmentNumber} - Tòa {apartment.building}
              {apartment.ownerName ? ` (${apartment.ownerName})` : ""}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

