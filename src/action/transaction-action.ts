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
  TransactionSummary,
  ApartmentTransactionRecord,
} from "@/app/(dashboard)/transactions/types";

export type {
  Transaction,
  CalculateTransactionPayload,
  CalculateTransactionResponse,
  CreateTransactionPayload,
  TransactionResponse,
  TransactionSummary,
  ApartmentTransactionRecord,
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

export async function getTransactionSummaries(): Promise<
  ActionResponse<TransactionSummary[]>
> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/transactions/apartments-summary`, {
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
        message: data.message || "Không thể tải danh sách tổng thu theo căn hộ",
      };
    }

    const list: TransactionSummary[] = Array.isArray(data.data)
      ? data.data.map((item: any) => ({
          apartmentId: item.apartmentId,
          name: item.name,
          building: item.building,
          area: item.area,
          ownerName: item.ownerName,
          totalCollected: item.totalCollected ?? 0,
          transactionCount: item.transactionCount ?? 0,
        }))
      : [];

    return { success: true, data: list };
  } catch (error) {
    console.error("getTransactionSummaries error:", error);
    return { success: false, message: "Lỗi kết nối" };
  }
}

export async function getApartmentTransactions(
  apartmentId: string
): Promise<ActionResponse<ApartmentTransactionRecord[]>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(
      `${backendUrl}/api/transactions/apartment/${apartmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Không thể tải chi tiết giao dịch căn hộ",
      };
    }

    const list: ApartmentTransactionRecord[] = Array.isArray(data.data)
      ? data.data.map((item: any) => ({
          _id: item._id,
          apartmentId: item.apartmentId,
          feeId: item.feeId,
          totalAmount: item.totalAmount ?? 0,
          payerName: item.payerName,
          createdBy: item.createdBy,
          date: item.date,
          month: item.month,
          year: item.year,
          usage: item.usage,
          unitPrice: item.unitPrice,
          status: item.status,
          createdAt: item.createdAt,
        }))
      : [];

    return { success: true, data: list };
  } catch (error) {
    console.error("getApartmentTransactions error:", error);
    return { success: false, message: "Lỗi kết nối" };
  }
}

export async function calculateTransaction(
  payload: CalculateTransactionPayload
): Promise<ActionResponse<CalculateTransactionResponse>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    console.log("calculateTransaction payload:", payload);
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
    console.log("calculateTransaction response:", data);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Không thể tính toán số tiền",
      };
    }

    const responseData = data.data || data;
    
    const mappedResponse: CalculateTransactionResponse = {
      success: true,
      totalAmount: responseData.totalAmount,
      unitPrice: responseData.unitPrice,
      quantity: responseData.quantity,
      apartment: responseData.apartment,
      fee: responseData.fee,
      formula: responseData.formula,
      apartmentInfo: responseData.apartmentInfo,
      feeInfo: responseData.feeInfo,
    };

    return {
      success: true,
      data: mappedResponse,
    };
  } catch (error) {
    console.error("Calculate transaction error:", error);
    return {
      success: false,
      message: "Lỗi kết nối khi tính toán",
    };
  }
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<ActionResponse<Transaction>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const now = new Date();
    const bodyPayload = {
      ...payload,
      year: payload.year ?? now.getFullYear(),
      month: payload.month ?? now.getMonth() + 1,
    };

    const res = await fetch(`${backendUrl}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyPayload),
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

