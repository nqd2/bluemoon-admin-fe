"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username phải có ít nhất 6 ký tự" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username phải có ít nhất 6 ký tự" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  code: z
    .string()
    .min(1, { message: "Mã đăng ký không được để trống" }),
});

export type AuthState = {
  success: boolean;
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    code?: string[];
  };
};

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${backendUrl}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: data.message || "Username hoặc mật khẩu không đúng",
        };
      }   
      return {
        success: false,
        message: data.message || "Lỗi hệ thống, vui lòng thử lại",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("access_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      message: "Đăng nhập thành công",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}

export async function registerAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = registerSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    code: formData.get("code"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password, code } = validatedFields.data;

  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${backendUrl}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, code }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        return {
          success: false,
          message: data.message || "Dữ liệu không hợp lệ",
        };
      }
      if (response.status === 401) {
        return {
          success: false,
          message: data.message || "Mã đăng ký không hợp lệ hoặc đã hết hạn",
        };
      }
      if (response.status === 409) {
        return {
          success: false,
          message: data.message || "Username đã được sử dụng",
        };
      }
      return {
        success: false,
        message: data.message || "Lỗi hệ thống, vui lòng thử lại",
      };
    }

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("access_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    return {
      success: true,
      message: "Đăng ký thành công",
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Lỗi kết nối, vui lòng thử lại sau",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");

  return { success: true };
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}
