import type { Metadata } from "next";
import SiteNavigation from "@/components/site-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบจองพื้นที่ตลาดกลางคืน",
  description: "ระบบจองพื้นที่ขายสินค้าในตลาดกลางคืนของโครงการ PJ05",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <SiteNavigation />
        {children}
      </body>
    </html>
  );
}
