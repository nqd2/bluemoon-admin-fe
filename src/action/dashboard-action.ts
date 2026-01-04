"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardStats } from "@/app/(dashboard)/dashboard/types";

// Re-export type for backward compatibility
export type { DashboardStats };

export interface DashboardResponse {
  success: boolean;
  data?: DashboardStats;
  message?: string;
}

/**
 * Server Action để lấy dashboard stats từ Backend
 * Endpoint: GET /api/stats/dashboard
 */
export async function getDashboardStats(): Promise<DashboardResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "Chưa đăng nhập",
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/stats/dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Phiên đăng nhập đã hết hạn",
        };
      }
      return {
        success: false,
        message: "Không thể tải dữ liệu dashboard",
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}
