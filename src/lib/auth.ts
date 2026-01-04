import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface BackendResponse {
  token?: string;
  user?: {
    id: string;
    username: string;
    role?: string;
  };
  success?: boolean;
  message?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any | null> {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
          console.error("BACKEND_URL is not defined");
          throw new Error("Lỗi cấu hình máy chủ");
        }

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const responseData: BackendResponse = await res.json();

          // Kiểm tra response thành công (200) VÀ có token
          if (res.ok && responseData.token) {
            // Nếu thành công, return đối tượng user
            return {
              id: responseData.user?.id || "",
              name: responseData.user?.username || credentials.username,
              email: credentials.username, // Dùng username làm email cho NextAuth
              username: responseData.user?.username || credentials.username,
              role: responseData.user?.role || "user",
              accessToken: responseData.token, // Token JWT từ backend
            };
          } else {
            // Ném lỗi với message từ backend
            throw new Error(
              responseData.message || "Username hoặc mật khẩu không đúng"
            );
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
    maxAge: 24 * 60 * 60, // 1 day
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const adminUser = user as any;
        token.accessToken = adminUser.accessToken;
        token.id = adminUser.id;
        token.username = adminUser.username;
        token.role = adminUser.role;
        // Lưu thời điểm đăng nhập
        token.loginTime = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  debug: process.env.NODE_ENV !== "production",
};
