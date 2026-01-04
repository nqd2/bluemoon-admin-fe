"use client";
import React from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const HeaderSearch = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0" size="xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-default-500 w-5 h-5" />
          <Input
            placeholder="Search..."
            className="pl-12 h-14 text-base border-0 focus:ring-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeaderSearch;

