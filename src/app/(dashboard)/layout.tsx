import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResidentsPrefetch from "./components/residents-prefetch";
import { cookies } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    try {
      const cookieStore = await cookies();
      cookieStore.delete("next-auth.session-token");
      cookieStore.delete("__Secure-next-auth.session-token");
    } catch (cookieError) {
    }
    
    redirect("/login");
  }
  
  if (!session || !session.user) {
    redirect("/login");
  }

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
