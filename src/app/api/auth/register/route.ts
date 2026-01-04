import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, code } = body;

    if (!username || !password || !code) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { success: false, message: "Lỗi cấu hình máy chủ" },
        { status: 500 }
      );
    }

    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, code }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}

