"use client";
import RegisterForm from "@/components/auth/register/reg-form";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const RegisterPage = () => {
  return (
    <div className="loginwrapper flex items-center min-h-screen overflow-hidden w-full">
      <div className="lg-inner-column grid grid-cols-2 w-full justify-center overflow-y-auto p-4">
        <div className="col-span-1 h-full w-full bg-no-repeat bg-center bg-cover hidden lg:block rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="w-full h-full flex justify-center items-center p-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-default-900">Tạo tài khoản mới</h1>
              <p className="text-default-600">Đăng ký để bắt đầu sử dụng hệ thống</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 flex justify-center items-center col-span-2 lg:col-span-1">
          <div className="sm:w-[480px] w-full">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
