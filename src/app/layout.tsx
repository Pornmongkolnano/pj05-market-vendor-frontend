import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import SiteFooter from "@/components/site-footer";
import SiteNavigation from "@/components/site-navigation";
import "./globals.css";

// Body font (nav links, text) and the italic display font (wordmark, headings)
const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
});
const cormorant = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	style: ["normal", "italic"],
	variable: "--font-cormorant",
});

export const metadata: Metadata = {
	title: "ScubiduPapa Night Market",
	description: "ระบบจองพื้นที่ขายสินค้าในตลาดกลางคืนของโครงการ PJ05",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="th" className={`${dmSans.variable} ${cormorant.variable}`}>
			{/* Three rows: nav bar (auto) / page content (fills the rest) / footer (auto).*/}
			<body className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-cream font-sans text-coffee-bean">
				<SiteNavigation />
				<div>{children}</div>
				<SiteFooter />
			</body>
		</html>
	);
}
