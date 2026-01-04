import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Đăng nhập | Admin Dashboard",
  description: "Đăng nhập vào hệ thống quản trị",
};

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border border-border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
