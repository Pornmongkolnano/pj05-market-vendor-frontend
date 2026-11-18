import BrandWordmark from "./brand-wordmark";

export default function SiteFooter() {
	return (
		<footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-[26px] sm:px-8 lg:px-16">
			<BrandWordmark tone="dark" />
			{/* plain text because we don't have a dedicated contact page yet */}
			<p className="text-xs leading-[1.45] text-taupe underline cursor-pointer">
				Contact the market
			</p>
		</footer>
	);
}
