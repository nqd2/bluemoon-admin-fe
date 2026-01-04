"use client";

import { useEffect } from "react";

/**
 * Component để prefetch residents data khi ở dashboard
 * Sử dụng router.prefetch hoặc fetch với cache để preload data
 */
export default function ResidentsPrefetch() {
  useEffect(() => {
    // Prefetch residents API để cache data
    fetch("/api/user/residents?limit=100", {
      method: "GET",
      // Không cần credentials vì API route sẽ tự xử lý session
    }).catch(() => {
      // Ignore errors, chỉ cần trigger fetch để cache
    });
  }, []);

  return null;
}

