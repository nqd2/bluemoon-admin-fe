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
import { Resident } from "../../residents/types";
import { cn } from "@/lib/utils";

interface ResidentSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function ResidentSelect({ value, onChange, error }: ResidentSelectProps) {
  const [residents, setResidents] = React.useState<Resident[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/residents?limit=100");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setResidents(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching residents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const filteredResidents = React.useMemo(() => {
    return residents.filter((resident) => !resident.apartmentId);
  }, [residents]);

  const selectedResident = residents.find((r) => r._id === value);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={loading}
    >
      <SelectTrigger
        className={cn(
          error && "border-destructive text-destructive"
        )}
      >
        <SelectValue placeholder={loading ? "Đang tải..." : "Chọn cư dân..."}>
          {selectedResident
            ? `${selectedResident.fullName} - ${selectedResident.identityCard}`
            : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
            Đang tải...
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có cư dân nào
          </div>
        ) : (
          filteredResidents.map((resident) => (
            <SelectItem key={resident._id} value={resident._id}>
              {resident.fullName} - {resident.identityCard} - {resident.gender} - {resident.dob ? resident.dob.split('T')[0] : ''}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
