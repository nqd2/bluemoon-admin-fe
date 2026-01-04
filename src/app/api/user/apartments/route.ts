import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.accessToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/apartments?page=1&limit=1000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Không thể tải danh sách căn hộ" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || [],
    });
  } catch (error) {
    console.error("Get apartments API error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối" },
      { status: 500 }
    );
  }
}

