"use server";

import { cookies } from "next/headers";

export interface DashboardStats {
  residents?: {
    total: number;
    temporary: number;
    permanent: number;
  };
  apartments?: {
    total: number;
    occupied: number;
    vacant: number;
  };
  revenue?: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  transactions?: {
    recent: Array<{
      id: string;
      apartmentId: string;
      apartmentName?: string;
      feeId: string;
      feeTitle?: string;
      totalAmount: number;
      payerName?: string;
      status: string;
      createdAt: string;
    }>;
    total: number;
  };
}

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
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value;

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

