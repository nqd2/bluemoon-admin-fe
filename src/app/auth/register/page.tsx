import RegisterForm from "@/components/auth/register/reg-form";

export const metadata = {
  title: "Đăng ký | Admin Dashboard",
  description: "Đăng ký tài khoản quản trị viên",
};

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Register Card */}
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border border-border">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
