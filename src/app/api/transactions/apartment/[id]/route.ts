import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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
    const { id } = await context.params;
    const res = await fetch(
      `${backendUrl}/api/transactions/apartment/${id}`,
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
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("API apartment transactions error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối" },
      { status: 500 }
    );
  }
}

