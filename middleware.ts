import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/register", "/forgot", "/api/auth"];

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    const isValidToken = token && (token as any).id && (token as any).accessToken && (token as any).role;
    if (isValidToken && (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname === "/")) {
       return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/login", req.url);
    if (!pathname.startsWith("/login") && 
        !pathname.startsWith("/register") && 
        !pathname.startsWith("/forgot") && 
        pathname !== "/" &&
        !pathname.startsWith("/api")) {
      const callbackUrl = decodeURIComponent(pathname);
      if (callbackUrl !== "/login" && !callbackUrl.startsWith("/login")) {
        url.searchParams.set("callbackUrl", encodeURI(pathname));
      }
    }
    return NextResponse.redirect(url);
  }

  const tokenData = token as any;
  if (!tokenData.id || !tokenData.accessToken || !tokenData.role) {
    const url = new URL("/login", req.url);
    if (!pathname.startsWith("/login") && pathname !== "/") {
      const callbackUrl = decodeURIComponent(pathname);
      if (callbackUrl !== "/login" && !callbackUrl.startsWith("/login")) {
        url.searchParams.set("callbackUrl", encodeURI(pathname));
      }
    }
    return NextResponse.redirect(url);
  }

  if (tokenData.isExpired) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  if (token.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > (token.exp as number)) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except the public/static assets listed below.
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};