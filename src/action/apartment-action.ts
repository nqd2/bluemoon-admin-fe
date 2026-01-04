"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type {
  Apartment,
  ApartmentListResponse,
  CreateApartmentPayload,
  AddMemberPayload,
} from "@/app/(dashboard)/apartments/types";

// Re-export for convenience
export type { Apartment, ApartmentListResponse, CreateApartmentPayload, AddMemberPayload };

interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

async function getAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.accessToken || null;
}

/**
 * Lấy danh sách căn hộ
 */
export async function getApartments(params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}): Promise<ActionResponse<ApartmentListResponse>> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, message: "Chưa đăng nhập" };

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.keyword) searchParams.set("keyword", params.keyword);

    const res = await fetch(`${process.env.BACKEND_URL}/api/apartments?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Không thể tải danh sách căn hộ" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Get apartments error:", error);
    return { success: false, message: "Lỗi kết nối" };
  }
}

/**
 * Lấy chi tiết căn hộ
 */
export async function getApartmentById(id: string): Promise<ActionResponse<Apartment>> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, message: "Chưa đăng nhập" };

    const res = await fetch(`${process.env.BACKEND_URL}/api/apartments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Không tìm thấy căn hộ" };
    }

    // Backend trả về { success: true, data: apartment }
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Get apartment detail error:", error);
    return { success: false, message: "Lỗi kết nối" };
  }
}

/**
 * Tạo căn hộ mới
 */
export async function createApartment(
  payload: CreateApartmentPayload
): Promise<ActionResponse<Apartment>> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, message: "Chưa đăng nhập" };

    const res = await fetch(`${process.env.BACKEND_URL}/api/apartments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Tạo căn hộ thất bại",
        errors: data.errors,
      };
    }

    revalidatePath("/apartments");
    return { success: true, data: data.data, message: "Tạo căn hộ thành công" };
  } catch (error) {
    console.error("Create apartment error:", error);
    return { success: false, message: "Lỗi kết nối" };
  }
}

/**
 * Thêm thành viên vào căn hộ
 */
export async function addMemberToApartment(
  apartmentId: string,
  payload: AddMemberPayload
): Promise<ActionResponse> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, message: "Chưa đăng nhập" };

    const res = await fetch(`${process.env.BACKEND_URL}/api/apartments/${apartmentId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Thêm thành viên thất bại",
        errors: data.errors,
      };
    }

    revalidatePath(`/apartments/${apartmentId}`);
    return { success: true, message: "Thêm thành viên thành công" };
  } catch (error) {
    console.error("Add member error:", error);
    return { success: false, message: "Lỗi kết nối" };
  }
}
