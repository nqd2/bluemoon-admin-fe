"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiteLogo } from "@/components/svg";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { registerAction, AuthState } from "@/action/auth-action";

// Schema validate: username (min 6) + password (min 6) + registration code
const registerSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username không được để trống" })
    .min(6, { message: "Username phải có ít nhất 6 ký tự" }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu không được để trống" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Xác nhận mật khẩu không được để trống" }),
  code: z
    .string()
    .min(1, { message: "Mã đăng ký không được để trống" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState<"password" | "text">("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  // Server Action state
  const [state, formAction] = useFormState<AuthState | null, FormData>(
    registerAction,
    null
  );

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  // Xử lý kết quả từ Server Action
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/dashboard");
    }
  }, [state, router]);

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  // Submit form qua Server Action
  const onSubmit = (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("code", data.code);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="w-full py-5">
      {/* Logo */}
      <Link href="/" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>

      {/* Header */}
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Tạo tài khoản mới
      </div>
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        Vui lòng nhập mã đăng ký được cung cấp bởi quản trị viên.
      </div>

      {/* Error Alert - Hiển thị lỗi từ API */}
      {state && !state.success && (
        <Alert color="destructive" variant="soft" className="mt-4">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4">
        {/* Registration Code Field */}
        <div>
          <Label htmlFor="code" className="mb-2 font-medium text-default-600">
            Mã đăng ký <span className="text-destructive">*</span>
          </Label>
          <Input
            disabled={isPending}
            {...register("code")}
            type="text"
            id="code"
            placeholder="ADMIN-XXXX-XXXX"
            className={cn("", {
              "border-destructive": errors.code || state?.errors?.code,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
          {errors.code && (
            <p className="text-destructive text-sm mt-1">{errors.code.message}</p>
          )}
          {state?.errors?.code && (
            <p className="text-destructive text-sm mt-1">{state.errors.code[0]}</p>
          )}
          <p className="text-muted-foreground text-xs mt-1">
            Mã đăng ký được cung cấp bởi quản trị viên hệ thống
          </p>
        </div>

        {/* Username Field */}
        <div>
          <Label htmlFor="username" className="mb-2 font-medium text-default-600">
            Username <span className="text-destructive">*</span>
          </Label>
          <Input
            disabled={isPending}
            {...register("username")}
            type="text"
            id="username"
            placeholder="admin123"
            className={cn("", {
              "border-destructive": errors.username || state?.errors?.username,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
          {errors.username && (
            <p className="text-destructive text-sm mt-1">{errors.username.message}</p>
          )}
          {state?.errors?.username && (
            <p className="text-destructive text-sm mt-1">{state.errors.username[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password" className="mb-2 font-medium text-default-600">
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
                "border-destructive": errors.password || state?.errors?.password,
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
                icon={passwordType === "password" ? "heroicons:eye" : "heroicons:eye-slash"}
                className="w-5 h-5 text-default-400"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
          )}
          {state?.errors?.password && (
            <p className="text-destructive text-sm mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <Label htmlFor="confirmPassword" className="mb-2 font-medium text-default-600">
            Xác nhận mật khẩu <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("confirmPassword")}
              type={passwordType}
              id="confirmPassword"
              placeholder="••••••••"
              className={cn("pr-10", {
                "border-destructive": errors.confirmPassword,
              })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-base text-default-600">
        Đã có tài khoản?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
