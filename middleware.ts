import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Lấy token từ request
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Danh sách các trang Public
  const publicPaths = ["/login", "/register", "/forgot", "/api/auth"];
  
  // Nếu là trang public -> Cho phép đi tiếp
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    // Nhưng nếu ĐÃ login mà vào Login/Register -> Redirect về dashboard
    // Check token có hợp lệ không (có id, accessToken, role)
    const isValidToken = token && (token as any).id && (token as any).accessToken && (token as any).role;
    if (isValidToken && (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname === "/")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Nếu đang ở trang public và chưa login -> Cho phép truy cập, không redirect
    return NextResponse.next();
  }

  // Nếu không phải trang public (tức là trang cần Auth như /dashboard)
  // Check Token tồn tại
  if (!token) {
    const url = new URL("/login", req.url);
    // Chỉ set callbackUrl nếu không phải đang ở trang login/public và là protected page
    if (!pathname.startsWith("/login") && 
        !pathname.startsWith("/register") && 
        !pathname.startsWith("/forgot") && 
        pathname !== "/" &&
        !pathname.startsWith("/api")) {
      // Tránh redirect loop: không set callbackUrl nếu nó là /login
      const callbackUrl = decodeURIComponent(pathname);
      if (callbackUrl !== "/login" && !callbackUrl.startsWith("/login")) {
        url.searchParams.set("callbackUrl", encodeURI(pathname));
      }
    }
    return NextResponse.redirect(url);
  }

  // Check Token có đầy đủ thông tin user không (id, accessToken, role)
  const tokenData = token as any;
  if (!tokenData.id || !tokenData.accessToken || !tokenData.role) {
    const url = new URL("/login", req.url);
    // Chỉ set callbackUrl nếu không phải đang ở trang login
    if (!pathname.startsWith("/login") && pathname !== "/") {
      const callbackUrl = decodeURIComponent(pathname);
      if (callbackUrl !== "/login" && !callbackUrl.startsWith("/login")) {
        url.searchParams.set("callbackUrl", encodeURI(pathname));
      }
    }
    return NextResponse.redirect(url);
  }

  // Check Token hết hạn (Logic custom từ project)
  if (tokenData.isExpired) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // Check Token hết hạn (Standard exp)
  if (token.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > (token.exp as number)) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }

  // Nếu mọi thứ ok -> Cho phép đi tiếp
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api/auth (NextAuth)
     * - _next/static, _next/image
     * - favicon.ico, images/svgs
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};