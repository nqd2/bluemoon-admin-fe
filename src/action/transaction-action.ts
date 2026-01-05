"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type {
  Transaction,
  CalculateTransactionPayload,
  CalculateTransactionResponse,
  CreateTransactionPayload,
  TransactionResponse,
} from "@/app/(dashboard)/transactions/types";

export type {
  Transaction,
  CalculateTransactionPayload,
  CalculateTransactionResponse,
  CreateTransactionPayload,
  TransactionResponse,
};

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
 * Tính toán số tiền cần đóng cho một căn hộ và khoản thu
 */
export async function calculateTransaction(
  payload: CalculateTransactionPayload
): Promise<ActionResponse<CalculateTransactionResponse>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/transactions/calculate`, {
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
        message: data.message || "Không thể tính toán số tiền",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Calculate transaction error:", error);
    return {
      success: false,
      message: "Lỗi kết nối khi tính toán",
    };
  }
}

/**
 * Ghi nhận giao dịch thanh toán
 */
export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<ActionResponse<Transaction>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/transactions`, {
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
        message: data.message || "Không thể ghi nhận giao dịch",
        errors: data.errors,
      };
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath(`/fees/${payload.feeId}`);

    return {
      success: true,
      data: data.data,
      message: data.message || "Ghi nhận thanh toán thành công",
    };
  } catch (error) {
    console.error("Create transaction error:", error);
    return {
      success: false,
      message: "Lỗi kết nối khi ghi nhận giao dịch",
    };
  }
}

