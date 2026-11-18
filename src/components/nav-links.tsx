"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { loginDestination } from "@/lib/auth-types";

export type NavItem = { href: string; label: string };

export function GuestAuthLinks() {
	const pathname = usePathname();
	const params = useSearchParams();
	const next = params.getAll("next");
	const destinations =
		pathname === "/login" && next.length === 0
			? params.getAll("callbackUrl")
			: next;
	const onAuthPage = pathname === "/login" || pathname === "/register";
	const destination =
		onAuthPage && destinations.length === 1
			? loginDestination(destinations[0])
			: undefined;
	const query = destination
		? `?${new URLSearchParams({ next: destination })}`
		: "";

	return (
		<div className="flex items-center gap-3 text-sm leading-[1.45] font-medium whitespace-nowrap text-sand">
			<Link
				href={`/register${query}`}
				aria-current={pathname === "/register" ? "page" : undefined}
				className="hover:text-light-apricot"
			>
				Register
			</Link>
			<Link
				href={`/login${query}`}
				aria-current={pathname === "/login" ? "page" : undefined}
				className="rounded-[5px] bg-chocolate px-2 py-px hover:bg-camel"
			>
				Login
			</Link>
		</div>
	);
}

// needs the current URL to underline the active page (client component).
export default function NavLinks({ items }: { items: NavItem[] }) {
	const pathname = usePathname();

	return (
		<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm leading-[1.45] whitespace-nowrap sm:gap-x-9">
			{items.map((item) => {
				const active =
					pathname === item.href || pathname.startsWith(`${item.href}/`);
				return (
					<li key={item.href}>
						<Link
							href={item.href}
							aria-current={active ? "page" : undefined}
							className={
								active
									? "font-bold text-light-apricot underline underline-offset-4"
									: "text-sand hover:text-light-apricot"
							}
						>
							{item.label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
