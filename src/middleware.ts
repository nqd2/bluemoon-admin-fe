import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Logic này chạy KHI đã được authorized (có token hợp lệ)
    // Mục đích: Nếu user đã login mà cố vào trang /auth/login hoặc /auth/register thì đẩy về /dashboard
    const token = req.nextauth.token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register");

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // 1. Danh sách các trang Public (Không cần đăng nhập vẫn vào được)
        const publicPaths = [
          "/auth/login",
          "/auth/register",
          "/auth/forgot",
          "/auth/verify",
          "/auth/create-password",
          "/api/auth",
        ];

        // Nếu path hiện tại nằm trong danh sách public -> Cho phép truy cập luôn
        if (publicPaths.some((p) => path.startsWith(p))) {
          return true;
        }

        // 2. Kiểm tra Token tồn tại
        if (!token) {
          return false; // Trả về false sẽ tự động redirect về trang 'signIn' cấu hình bên dưới
        }

        // 3. Kiểm tra Token hết hạn
        // JWT thường có trường 'exp' (thời gian hết hạn tính bằng giây)
        if (token.exp) {
          const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
          if (currentTime > (token.exp as number)) {
            // Token đã hết hạn -> Chặn
            return false;
          }
        }

        // Nếu qua được hết các bước trên -> Cho phép truy cập
        return true;
      },
    },
    pages: {
      signIn: "/auth/login", // Trang để redirect về khi bị chặn (return false)
    },
  }
);

// Cấu hình Matcher để middleware chạy trên TOÀN BỘ trang web
export const config = {
  matcher: [
    /*
     * Match tất cả các đường dẫn TRỪ những đường dẫn bắt đầu bằng:
     * - api/auth (để cho NextAuth hoạt động)
     * - _next/static (file tĩnh của Next.js)
     * - _next/image (ảnh tối ưu hóa)
     * - favicon.ico (icon web)
     * - public (thư mục public nếu có)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
