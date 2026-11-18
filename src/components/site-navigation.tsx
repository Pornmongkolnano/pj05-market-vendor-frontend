import { getSessionViewer } from "@/lib/auth";
import AccountMenu from "./account-menu";
import BrandWordmark from "./brand-wordmark";
import NavLinks, { GuestAuthLinks, type NavItem } from "./nav-links";

const memberLinks: NavItem[] = [
	{ href: "/spots", label: "Explore spots" },
	{ href: "/bookings", label: "My bookings" },
];

const adminLinks: NavItem[] = [
	{ href: "/admin/spots", label: "Manage spots" },
	{ href: "/admin/bookings", label: "Manage bookings" },
	{ href: "/admin/dashboard", label: "Dashboard" },
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
						<GuestAuthLinks />
					)}
				</div>
			</nav>
		</header>
	);
}
