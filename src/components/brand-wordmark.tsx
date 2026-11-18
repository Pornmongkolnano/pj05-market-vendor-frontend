import Link from "next/link";

// "ScubiduPapa  NIGHT MARKET" logo, used in the nav bar (light) and footer (dark)
export default function BrandWordmark({
	tone = "light",
	admin = false,
}: {
	tone?: "light" | "dark";
	admin?: boolean;
}) {
	return (
		<Link
			href={admin ? "/admin/dashboard" : "/spots"}
			className="inline-flex items-center gap-3 whitespace-nowrap"
			aria-label={
				admin
					? "ScubiduPapa Night Market: dashboard"
					: "ScubiduPapa Night Market: explore spots"
			}
		>
			<span
				className={`font-display text-[28px] leading-[1.08] font-bold italic sm:text-[34px] ${
					tone === "light" ? "text-light-apricot" : "text-dark-coffee"
				}`}
			>
				ScubiduPapa
			</span>
			<span className="hidden text-[10px] leading-[1.45] font-bold tracking-[2px] text-camel sm:inline">
				NIGHT MARKET
			</span>
		</Link>
	);
}
