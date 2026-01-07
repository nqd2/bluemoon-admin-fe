 "use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username không được để trống" })
    .min(6, { message: "Username phải có ít nhất 6 ký tự" }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu không được để trống" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState<"password" | "text">(
    "password"
  );
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      try {
        const result = await signIn("Credentials", {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          console.error("[Login Form] Login error:", result.error);
          toast.error(
            result.error === "CredentialsSignin"
              ? "Username hoặc mật khẩu không đúng"
              : result.error
          );
        } else if (result?.ok) {
          toast.success("Đăng nhập thành công! Đang chuyển hướng...");

          await new Promise((resolve) => setTimeout(resolve, 100));

          const params = new URLSearchParams(window.location.search);
          const callbackUrl = params.get("callbackUrl") || "/dashboard";
          window.location.href = callbackUrl;
        }
      } catch (error) {
        console.error("[Login Form] Login Error:", error);
        toast.error("Đã xảy ra lỗi không mong muốn.");
      }
    });
  };

  return (
    <div className="w-full py-5">
      <Link href="/" className="inline-block mb-4">
        <Image
          src="/images/logo/horizontal-logo.png"
          alt="BlueMoon Logo"
          width={180}
          height={40}
          className="w-auto h-10 2xl:h-14 object-contain text-primary"
        />
      </Link>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="2xl:text-3xl text-2xl font-bold text-default-900">
            Chào mừng bạn!
          </CardTitle>
          <CardDescription className="2xl:text-lg text-base text-default-600 leading-6">
            Đăng nhập để tiếp tục vào hệ thống quản trị.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="mb-2 font-medium text-default-600"
              >
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                disabled={isPending}
                {...register("username")}
                type="text"
                id="username"
                placeholder="admin123"
                className={cn("", {
                  "border-destructive": errors.username,
                })}
                size={!isDesktop2xl ? "xl" : "lg"}
              />
              {errors.username && (
                <p className="text-destructive text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="mb-2 font-medium text-default-600"
              >
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  disabled={isPending}
                  {...register("password")}
                  type={passwordType}
                  id="password"
                  placeholder="••••••••"
                  className={cn("pr-10", {
                    "border-destructive": errors.password,
                  })}
                  size={!isDesktop2xl ? "xl" : "lg"}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                  onClick={togglePasswordType}
                  tabIndex={-1}
                >
                  <Icon
                    icon={
                      passwordType === "password"
                        ? "heroicons:eye"
                        : "heroicons:eye-slash"
                    }
                    className="w-5 h-5 text-default-400"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot"
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isPending}
              size={!isDesktop2xl ? "lg" : "md"}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 text-center text-base text-default-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Đăng ký
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
