import Link from "next/link";
import { getSessionViewer } from "@/lib/auth";
import AccountMenu from "./account-menu";
import BrandWordmark from "./brand-wordmark";
import NavLinks, { type NavItem } from "./nav-links";

const memberLinks: NavItem[] = [
	{ href: "/spots", label: "Explore spots" },
	{ href: "/bookings", label: "My bookings" },
];

const adminLinks: NavItem[] = [
	{ href: "/admin/spots", label: "Manage spots" },
	{ href: "/admin/bookings", label: "Manage bookings" },
];

// Server component: reads the session on the server, then picks the links to show.
// Guests and members see the same links ("My bookings" sends guests to log in first).
export default async function SiteNavigation() {
	const viewer = await getSessionViewer();
	const links = viewer?.role === "admin" ? adminLinks : memberLinks;

	return (
		<header className="sticky top-0 z-30 bg-dark-coffee">
			{/* grid 1fr auto 1fr = logo (left) | links (centred) | account (right). */}
			<nav
				aria-label="Main"
				className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 px-4 pt-[19px] pb-[22px] sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-16"
			>
				<div className="justify-self-start">
					<BrandWordmark tone="light" />
				</div>

				<div className="col-span-2 row-start-2 justify-self-center md:col-span-1 md:row-start-auto">
					<NavLinks items={links} />
				</div>

				<div className="justify-self-end">
					{viewer ? (
						<AccountMenu name={viewer.name} />
					) : (
						<div className="flex items-center gap-3 text-sm leading-[1.45] font-medium whitespace-nowrap text-sand">
							<Link href="/register" className="hover:text-light-apricot">
								Register
							</Link>
							<Link
								href="/login"
								className="rounded-[5px] bg-chocolate px-2 py-px hover:bg-camel"
							>
								Login
							</Link>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
}
