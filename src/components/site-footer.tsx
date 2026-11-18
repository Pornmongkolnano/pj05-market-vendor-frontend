import { getSessionViewer } from "@/lib/auth";
import BrandWordmark from "./brand-wordmark";

export default async function SiteFooter() {
	const viewer = await getSessionViewer();
	return (
		<footer className="border-t border-line px-4 py-[26px] sm:px-8 lg:px-16">
			<BrandWordmark tone="dark" admin={viewer?.role === "admin"} />
		</footer>
	);
}
