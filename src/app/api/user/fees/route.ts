import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFees } from "@/action/fee-action";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "1000", 10);
    const type = searchParams.get("type") as "Service" | "Contribution" | null;

    const result = await getFees({
      page: 1,
      limit,
      type: type || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Không thể tải danh sách khoản thu" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: result.data || [],
    });
    
    response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối" },
      { status: 500 }
    );
  }
}

