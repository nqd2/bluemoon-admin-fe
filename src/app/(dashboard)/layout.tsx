import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResidentsPrefetch from "./components/residents-prefetch";
import { cookies } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
  // Kiểm tra session như một lớp bảo vệ bổ sung (defense in depth)
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    // Nếu có lỗi JWT decryption (secret không khớp hoặc cookie corrupt)
    // Clear NextAuth session cookies nếu có
    try {
      const cookieStore = await cookies();
      cookieStore.delete("next-auth.session-token");
      cookieStore.delete("__Secure-next-auth.session-token");
    } catch (cookieError) {
      // Ignore cookie errors
    }
    
    // Redirect về login
    redirect("/login");
  }
  
  // Nếu không có session hoặc session không hợp lệ -> redirect về login
  if (!session || !session.user) {
    redirect("/login");
  }

  // Kiểm tra session có đầy đủ thông tin không
  const user = session.user as any;
  if (!user.id || !user.accessToken || !user.role) {
    redirect("/login");
  }

  const trans = await getDictionary();

  return (
    <DashBoardLayoutProvider trans={trans}>
      <ResidentsPrefetch />
      {children}
    </DashBoardLayoutProvider>
  );
};

export default layout;
