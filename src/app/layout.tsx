import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import AuthProvider from "@/provider/auth.provider";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/logo/favicon.ico",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description || "BlueMoon Admin Dashboard for managing residents, apartments, and fees.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bluemoon.com",
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/logo/Bluemoon.png",
        width: 800,
        height: 600,
        alt: "BlueMoon Admin Dashboard",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description || "BlueMoon Admin Dashboard for managing residents, apartments, and fees.",
    images: ["/images/logo/Bluemoon.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = "vi";

  return (
    <html lang={lang}>
      <AuthProvider>
        <TanstackProvider>
          <Providers>
            <DirectionProvider lang={lang}>{children}</DirectionProvider>
          </Providers>
        </TanstackProvider>
      </AuthProvider>
    </html>
  );
}
