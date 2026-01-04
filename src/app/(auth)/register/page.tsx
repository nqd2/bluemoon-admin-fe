import RegisterForm from "@/components/auth/register/reg-form";
import Image from "next/image";

export const metadata = {
  title: "Đăng ký | Admin Dashboard",
  description: "Đăng ký tài khoản quản trị viên",
};

const RegisterPage = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-background"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="w-[240px]">
          <Image
            src="/images/logo/horizontal-logo.png"
            alt="Bluemoon Logo"
            width={240}
            height={80}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Register Card */}
        <div className="bg-card w-full rounded-lg shadow-lg p-6 md:p-8 border border-border">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
