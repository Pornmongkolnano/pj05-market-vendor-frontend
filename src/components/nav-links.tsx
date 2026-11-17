"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

// needs the current URL to underline the active page (client component).
export default function NavLinks({ items }: { items: NavItem[] }) {
	const pathname = usePathname();

	return (
		<ul className="flex items-center gap-6 text-sm leading-[1.45] whitespace-nowrap sm:gap-9">
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
