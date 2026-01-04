"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "../../../../hooks/use-debounce";
import { getResidents } from "@/action/resident-action";
import { Resident } from "../../residents/types";

// Nếu chưa có hook useDebounce, tôi sẽ implement debounce thủ công trong useEffect

interface ResidentSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function ResidentSelect({ value, onChange, error }: ResidentSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [residents, setResidents] = React.useState<Resident[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const [selectedResident, setSelectedResident] = React.useState<Resident | null>(null);
  
  const debouncedKeyword = useDebounce(keyword, 500);

  // Debounce search
  React.useEffect(() => {
    fetchResidents(debouncedKeyword);
  }, [debouncedKeyword]);

  // Load selected resident detail if value exists but not in list
  React.useEffect(() => {
    if (value && !selectedResident) {
      // Find inside current list
      const exist = residents.find((r) => r._id === value);
      if (exist) {
        setSelectedResident(exist);
      } else {
        // Nếu không có trong list hiện tại (do search), có thể cần fetch detail. 
        // Tuy nhiên ở đây để đơn giản ta giả sử user phải search lại hoặc list initial đã bao gồm.
        // Tốt nhất là fetch list default ban đầu.
      }
    }
  }, [value, residents, selectedResident]);

  const fetchResidents = async (search: string) => {
    setLoading(true);
    try {
      const res = await getResidents({ keyword: search, limit: 10, page: 1 });
      if (res.success && res.data) {
        setResidents(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            error && "border-destructive text-destructive"
          )}
        >
          {selectedResident
            ? `${selectedResident.fullName} (${selectedResident.identityCard})`
            : "Chọn cư dân..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}> 
          {/* shouldFilter=false vì ta filter server-side */}
          <CommandInput 
            placeholder="Tìm theo tên hoặc CMND..." 
            value={keyword}
            onValueChange={setKeyword}
          />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                Đang tìm kiếm...
              </div>
            ) : (
              <>
                {residents.length === 0 && (
                  <CommandEmpty>Không tìm thấy cư dân nào.</CommandEmpty>
                )}
                <CommandGroup>
                  {residents.map((resident) => (
                    <CommandItem
                      key={resident._id}
                      value={resident._id}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setSelectedResident(currentValue === value ? null : resident);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === resident._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{resident.fullName}</span>
                        <span className="text-xs text-muted-foreground">{resident.identityCard} - {resident.gender} - {resident.dob ? resident.dob.split('T')[0] : ''}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
