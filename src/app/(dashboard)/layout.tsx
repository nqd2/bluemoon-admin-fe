import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { authOptions } from "@/lib/auth";
import { getServerSession, NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/app/dictionaries";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions as NextAuthOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const trans = await getDictionary();

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default layout;
