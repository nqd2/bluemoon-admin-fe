import {
  DashBoard,
  Sheild,
  Error,
  Graph,
} from "@/components/svg";

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
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
        title: "Authentication",
        icon: Sheild,
        child: [
          {
            title: "Sign In",
            href: "/auth/login",
          },
          {
            title: "Sign Up",
            href: "/auth/register",
          },
          {
            title: "Forgot Password",
            href: "/auth/forgot",
          },
          {
            title: "Verify Email",
            href: "/auth/verify",
          },
          {
            title: "Create Password",
            href: "/auth/create-password",
          },
        ],
      },
      {
        title: "Error Pages",
        icon: Error,
        child: [
          {
            title: "Error 401",
            href: "/error-page/401",
          },
          {
            title: "Error 403",
            href: "/error-page/403",
          },
          {
            title: "Error 404",
            href: "/error-page/404",
          },
          {
            title: "Error 500",
            href: "/error-page/500",
          },
        ],
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "menu",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        isHeader: true,
        title: "Pages",
      },
      {
        title: "Authentication",
        icon: Sheild,
        child: [
          {
            title: "Sign In",
            href: "/auth/login",
          },
          {
            title: "Sign Up",
            href: "/auth/register",
          },
          {
            title: "Forgot Password",
            href: "/auth/forgot",
          },
          {
            title: "Verify Email",
            href: "/auth/verify",
          },
          {
            title: "Create Password",
            href: "/auth/create-password",
          },
        ],
      },
      {
        title: "Error Pages",
        icon: Error,
        child: [
          {
            title: "Error 401",
            href: "/error-page/401",
          },
          {
            title: "Error 403",
            href: "/error-page/403",
          },
          {
            title: "Error 404",
            href: "/error-page/404",
          },
          {
            title: "Error 500",
            href: "/error-page/500",
          },
        ],
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
