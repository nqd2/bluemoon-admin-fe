"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type {
  Resident,
  ResidentListResponse,
  ResidentResponse,
  CreateResidentPayload,
  UpdateResidentPayload,
} from "@/app/(dashboard)/residents/types";

// Re-export types for convenience
export type { Resident, ResidentListResponse, CreateResidentPayload, UpdateResidentPayload };

interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Lấy access token từ session
 */
async function getAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.accessToken || null;
}

export async function getResidents(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<ActionResponse<ResidentListResponse>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.keyword) searchParams.set("keyword", params.keyword);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const url = `${backendUrl}/api/residents?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    console.log("\n--- Debug getResidents ---");
    console.log("URL:", url);
    console.log("Token exists:", !!token);
    console.log("Response Status:", response.status);
    // console.log("Response Data Preview:", JSON.stringify(data).substring(0, 200));
    
    if (!response.ok) {
      console.error("Fetch failed:", data);
      return {
        success: false,
        message: data.message || "Không thể tải danh sách cư dân",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("❌ Get residents error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}

/**
 * Lấy chi tiết một resident theo ID
 */
export async function getResidentById(id: string): Promise<ActionResponse<Resident>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "Chưa đăng nhập" };
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/residents/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Không tìm thấy cư dân",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Get resident by id error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}

/**
 * Tạo mới resident
 */
export async function createResident(
  payload: CreateResidentPayload
): Promise<ActionResponse<Resident>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "Chưa đăng nhập" };
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/residents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Không thể tạo cư dân mới",
        errors: data.errors,
      };
    }

    revalidatePath("/residents");
    
    return {
      success: true,
      data: data.data,
      message: "Thêm cư dân thành công",
    };
  } catch (error) {
    console.error("Create resident error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}

/**
 * Cập nhật resident
 */
export async function updateResident(
  id: string,
  payload: UpdateResidentPayload
): Promise<ActionResponse<Resident>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "Chưa đăng nhập" };
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/residents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Không thể cập nhật thông tin cư dân",
        errors: data.errors,
      };
    }

    revalidatePath("/residents");

    return {
      success: true,
      data: data.data,
      message: "Cập nhật thành công",
    };
  } catch (error) {
    console.error("Update resident error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}

/**
 * Xóa resident
 */
export async function deleteResident(id: string): Promise<ActionResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "Chưa đăng nhập" };
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/residents/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Không thể xóa cư dân",
      };
    }

    revalidatePath("/residents");

    return {
      success: true,
      message: "Xóa cư dân thành công",
    };
  } catch (error) {
    console.error("Delete resident error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}
