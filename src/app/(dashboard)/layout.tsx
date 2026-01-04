import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";

const layout = async ({ children }: { children: React.ReactNode }) => {
  // Middleware đã xử lý authentication, không cần check ở đây nữa
  const trans = await getDictionary();

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default layout;
