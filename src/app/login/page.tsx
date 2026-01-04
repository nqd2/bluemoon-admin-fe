"use client";
import LoginForm from "@/components/auth/login-form";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LoginPage = () => {
  return (
    <div className="loginwrapper flex items-center min-h-screen overflow-hidden w-full">
      <div className="lg-inner-column grid lg:grid-cols-2 w-full flex-wrap justify-center p-4 overflow-y-auto">
        <div className="h-full w-full bg-no-repeat bg-center bg-cover hidden lg:block rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="w-full h-full flex justify-center items-center p-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-default-900">Hệ thống quản trị</h1>
              <p className="text-default-600">Chào mừng bạn quay trở lại</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 flex justify-center items-center">
          <div className="lg:w-[480px] w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
