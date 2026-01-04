import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AdminUser {
  _id: string;
  username: string;
  role: string;
  token: string;
}

interface BackendResponse {
  success: boolean;
  message: string;
  data?: AdminUser;
  errors?: any[];
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "User name", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req): Promise<any | null> {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

        if (!backendUrl) {
          console.error("ADMIN_BACKEND_URL is not defined");
          throw new Error("Lỗi cấu hình máy chủ");
        }

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const responseData: BackendResponse = await res.json();

          // Kiểm tra response thành công (200) VÀ cờ success: true
          if (res.ok && responseData.success && responseData.data) {
            
            // Nếu thành công, return đối tượng user
            return {
              id: responseData.data._id,
              name: responseData.data.username,
              email: credentials.username, // Backend không trả về email, ta dùng lại từ form
              role: responseData.data.role, // Thêm role
              accessToken: responseData.data.token, // Token JWT từ backend
            };
          } else {
            // Ném lỗi với message từ backend
            throw new Error(responseData.message || "Email hoặc mật khẩu không đúng");
          }
        } catch (error: any) {
          console.error("Authorize error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60, // 2 days mặc định
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const adminUser = user as any;
        token.accessToken = adminUser.accessToken;
        token.id = adminUser.id;
        token.role = adminUser.role;
        // Lưu thời điểm đăng nhập để kiểm tra session duration
        token.loginTime = Date.now();
      }
      
      // Kiểm tra thời gian hết hạn của session dựa trên role
      if (token.loginTime) {
        const now = Date.now();
        const role = token.role as string;
        
        // sysops: 2 ngày (48 giờ), các user khác: 1 giờ
        const sessionDuration = role === 'sysops' 
          ? 2 * 24 * 60 * 60 * 1000  // 2 days
          : 60 * 60 * 1000;           // 1 hour
        
        const expiredTime = token.loginTime as number + sessionDuration;
        
        // Đánh dấu token đã hết hạn
        token.isExpired = now > expiredTime;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Nếu token đã hết hạn, không trả về session
      if ((token as any).isExpired) {
        return null as any;
      }
      
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Nếu redirect về /login hoặc /register, chuyển về /dashboard
      if (url.includes("/login") || url.includes("/register")) {
        return `${baseUrl}/dashboard`;
      }
      // Nếu là relative URL và không phải auth page, cho phép
      if (url.startsWith("/") && !url.startsWith("/login") && !url.startsWith("/register")) {
        return `${baseUrl}${url}`;
      }
      // Nếu là absolute URL và cùng domain, cho phép
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Mặc định về dashboard
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: '/login', 
  },

  debug: process.env.NODE_ENV !== "production",
};
