import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Hộ khẩu / Căn hộ",
  description: "Quản lý thông tin hộ khẩu, căn hộ và thành viên",
};

export default function ApartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
