import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบจองพื้นที่ตลาดกลางคืน",
  description: "ระบบจองพื้นที่ขายสินค้าในตลาดกลางคืนของโครงการ PJ05",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
