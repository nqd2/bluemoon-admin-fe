import {
  DashBoard,
  Users,
  Building,
  Files,
  Graph,
  Sheild,
  UserSign,
} from "@/components/svg";

export interface MenuItemProps {
  title: string;
  icon?: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean;
}

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        title: "QL Cư dân",
        icon: Users,
        href: "/residents",
      },
      {
        title: "QL Căn hộ",
        icon: Building,
        href: "/apartments",
      },
      {
        title: "QL Khoản thu",
        icon: Files,
        href: "/fees",
      },
      {
        title: "QL Giao dịch",
        icon: Graph,
        href: "/transactions",
      },
      {
        title: "Mã đăng ký",
        icon: Sheild,
        href: "/registration-codes",
      },
      {
        title: "Đăng xuất",
        icon: UserSign,
        href: "/logout",
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "Menu",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        isHeader: true,
        title: "Quản lý",
      },
      {
        title: "QL Cư dân",
        icon: Users,
        href: "/residents",
      },
      {
        title: "QL Căn hộ",
        icon: Building,
        href: "/apartments",
      },
      {
        title: "QL Khoản thu",
        icon: Files,
        href: "/fees",
      },
      {
        title: "QL Giao dịch",
        icon: Graph,
        href: "/transactions",
      },
      {
        isHeader: true,
        title: "Hệ thống",
      },
      {
        title: "Mã đăng ký",
        icon: Sheild,
        href: "/registration-codes",
      },
      {
        title: "Đăng xuất",
        icon: UserSign,
        href: "/logout",
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
