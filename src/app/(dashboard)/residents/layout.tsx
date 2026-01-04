import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Cư dân",
  description: "Quản lý thông tin cư dân trong chung cư",
};

export default function ResidentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
