import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getResidents } from "@/action/resident-action";

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
    const keyword = searchParams.get("keyword") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const result = await getResidents({
      keyword,
      limit,
      page: 1,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Không thể tải danh sách cư dân" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: result.data?.residents || [],
    });
    
    // Add cache headers để browser có thể cache response
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

