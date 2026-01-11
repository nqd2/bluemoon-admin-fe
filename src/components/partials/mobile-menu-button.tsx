"use client";
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store";
import { useMediaQuery } from "@/hooks/use-media-query";

const MobileMenuButton = () => {
  const { mobileMenu, setMobileMenu } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (isDesktop) {
    return null;
  }

  return (
    <Button
      onClick={() => setMobileMenu(!mobileMenu)}
      size="icon"
      className="fixed bottom-6 left-6 z-[9998] h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
      aria-label="Toggle menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
};

export default MobileMenuButton;
