"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type {
  Fee,
  CreateFeePayload,
  FeeListResponse,
  FeeResponse,
  FeeStatusResponse,
} from "@/app/(dashboard)/fees/types";

async function getAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  const user = session.user as any;
  return user.accessToken;
}

export interface GetFeesParams {
  page?: number;
  limit?: number;
  type?: "Service" | "Contribution";
}

export async function getFees(params: GetFeesParams = {}): Promise<FeeListResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const { page = 1, limit = 10, type } = params;
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    
    let url = `${backendUrl}/api/fees?page=${page}&limit=${limit}`;
    if (type) {
      url += `&type=${type}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: data.message || "Không thể tải danh sách khoản thu",
      };
    }

    return {
      success: true,
      data: data.data || [],
      pagination: data.pagination || { page, limit, total: 0, totalPages: 0 },
    };
  } catch (error) {
    console.error("Get fees error:", error);
    return {
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      message: "Lỗi kết nối",
    };
  }
}

export async function createFee(payload: CreateFeePayload): Promise<FeeResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Không thể tạo khoản thu",
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || "Tạo khoản thu thành công",
    };
  } catch (error) {
    console.error("Create fee error:", error);
    return {
      success: false,
      message: "Lỗi kết nối",
    };
  }
}

export async function getFeeStatus(id: string): Promise<FeeStatusResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/fees/${id}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        data: {
          feeInfo: {} as Fee,
          apartments: [],
        },
        message: data.message || "Không thể tải tình trạng khoản thu",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Get fee status error:", error);
    return {
      success: false,
      data: {
        feeInfo: {} as Fee,
        apartments: [],
      },
      message: "Lỗi kết nối",
    };
  }
}

