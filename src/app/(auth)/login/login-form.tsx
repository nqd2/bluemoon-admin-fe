"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên đăng nhập là bắt buộc." })
    .min(6, { message: "Tên đăng nhập phải có ít nhất 6 ký tự." }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu là bắt buộc." })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
});

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState("password");

  const togglePasswordType = () => {
    setPasswordType(prev => prev === "text" ? "password" : "text");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast({
            title: "Đăng nhập thất bại",
            description: "Sai thông tin đăng nhập",
            color: "destructive",
          });
        } else if (result?.ok) {
          toast({
            title: "Thành công",
            description: "Đăng nhập thành công! Đang chuyển hướng...",
          });
          router.push("/dashboard");
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        const isNetworkError = error?.message?.includes("fetch") || error?.code === "ECONNREFUSED";
        toast({
          title: "Lỗi",
          description: isNetworkError 
            ? "Lỗi hệ thống, vui lòng thử lại"
            : "Lỗi hệ thống, vui lòng thử lại",
          color: "destructive",
        });
      }
    });
  };

  return (
    <div className="w-full py-10">
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-default-900">
          Hệ thống quản trị CNS
        </h1>
      </div>

      <div className="text-center text-base text-default-600 mb-6">
        Nhập thông tin tài khoản bạn được cấp.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-default-600">
                  Tài khoản
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tài khoản..."
                    disabled={isPending}
                    size="lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-default-600">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={passwordType}
                      placeholder="Nhập mật khẩu..."
                      disabled={isPending}
                      size="lg"
                      className="pr-10"
                      {...field}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                      onClick={togglePasswordType}
                    >
                      {passwordType === "password" ? (
                        <Icon icon="heroicons:eye" className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link
              href="/auth/forgot"
              className="text-sm font-medium text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            size="lg"
            disabled={isPending}
          >
            {isPending && (
              <Icon icon="svg-spinners:180-ring" className="mr-2 h-5 w-5 animate-spin" />
            )}
            {isPending ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-base text-default-600">
        Không có tài khoản?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Liên hệ Admin
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;