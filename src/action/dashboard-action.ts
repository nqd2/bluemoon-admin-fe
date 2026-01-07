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

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/stats/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

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

    const raw = await response.json();
    const apiData = raw.data || raw;

    const stats: DashboardStats = {
      residents: {
        total: apiData.totalResidents ?? 0,
        permanent: apiData.totalResidents ?? 0,
        temporary: 0,
      },
      apartments: {
        total: apiData.apartmentStats?.total ?? apiData.totalApartments ?? 0,
        occupied:
          apiData.apartmentStats?.status?.find(
            (s: any) => s.status === "Occupied"
          )?.count ?? 0,
        vacant:
          apiData.apartmentStats?.status?.find(
            (s: any) => s.status === "Vacant"
          )?.count ?? 0,
      },
      revenue: {
        total: apiData.totalRevenue ?? 0,
        thisMonth: apiData.currentMonthRevenue ?? 0,
        lastMonth: apiData.lastMonthRevenue ?? 0,
      },
      transactions: {
        total: Array.isArray(apiData.recentTransactions)
          ? apiData.recentTransactions.length
          : 0,
        recent: Array.isArray(apiData.recentTransactions)
          ? apiData.recentTransactions.map((tx: any, index: number) => ({
              id: tx.id || `${tx.apartment}-${tx.fee}-${tx.date}-${index}`,
              apartmentId: tx.apartmentId || "",
              apartmentName: tx.apartment,
              feeId: tx.feeId || "",
              feeTitle: tx.fee,
              totalAmount: tx.amount ?? 0,
              payerName: tx.payerName || "",
              status: (tx.status as string) || "paid",
              createdAt: tx.date,
            }))
          : [],
      },
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}
