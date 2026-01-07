"use client";

import { useEffect } from "react";

export default function ResidentsPrefetch() {
  useEffect(() => {
    fetch("/api/user/residents?limit=100", {
      method: "GET",
    }).catch(() => {
    });
  }, []);

  return null;
}

