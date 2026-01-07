"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  useEffect(() => {
    // Đăng xuất và chuyển về trang đăng nhập
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-default-600">Đang đăng xuất...</p>
    </div>
  );
}


