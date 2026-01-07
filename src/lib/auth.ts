import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AdminUser {
  _id: string;
  username: string;
  role: string;
}

interface BackendResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
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

        const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

        if (!backendUrl) {
          console.error("BACKEND_URL is not defined");
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

          if (res.ok && responseData.success && responseData.user && responseData.token) {
            return {
              id: responseData.user._id,
              name: responseData.user.username,
              email: credentials.username,
              role: responseData.user.role,
              accessToken: responseData.token,
            };
          } else {
            throw new Error(responseData.message || "Username hoặc mật khẩu không đúng");
          }
        } catch (error: any) {

          if (error.name === 'TypeError' || error.message.includes('fetch')) {
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
          }
          throw new Error(error.message);
        }
      },
    }),
  ],

  secret: (() => {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("AUTH_SECRET or NEXTAUTH_SECRET environment variable is required");
    }
    return secret;
  })(),
  
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const adminUser = user as any;
        token.accessToken = adminUser.accessToken;
        token.id = adminUser.id;
        token.role = adminUser.role;

        token.loginTime = Date.now();
      }
      

      if (token.loginTime) {
        const now = Date.now();
        const role = token.role as string;
        

        const sessionDuration = role === 'admin' 
          ? 2 * 24 * 60 * 60 * 1000
          : 60 * 60 * 1000;
        
        const expiredTime = token.loginTime as number + sessionDuration;
        

        token.isExpired = now > expiredTime;
      }
      
      return token;
    },
    async session({ session, token }) {

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
  },

  pages: {
    signIn: '/login', 
  },

  debug: process.env.NODE_ENV !== "production",
};
