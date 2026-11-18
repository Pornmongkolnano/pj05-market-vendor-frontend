"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "./use-logout";

const menuItem =
	"flex min-h-10 items-center rounded px-3 py-2 text-left whitespace-nowrap hover:bg-camel";

export default function AccountMenu({
	name,
	admin,
}: {
	name: string;
	admin: boolean;
}) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { logout, isSubmitting, failed } = useLogout();

	// Close when clicking anywhere outside the menu, or pressing Escape
	useEffect(() => {
		if (!open) return;
		function onPointerDown(event: PointerEvent) {
			if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	return (
		<div ref={menuRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				className="flex max-w-full cursor-pointer items-center gap-2.5 text-sm leading-[1.45] font-medium text-sand hover:text-light-apricot"
			>
				<span className="min-w-0 truncate">Hello, {name}</span>
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					aria-hidden="true"
					className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
				>
					<path
						d="M5 7l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{open ? (
				<div className="absolute top-full right-0 z-40 mt-2 grid min-w-32 gap-1 rounded-md border border-taupe bg-soft-fawn p-1 text-sm text-coffee-bean shadow-md">
					{admin ? (
						<Link
							href="/register"
							className={menuItem}
							onClick={() => setOpen(false)}
						>
							Create account
						</Link>
					) : null}
					<button
						type="button"
						onClick={logout}
						disabled={isSubmitting}
						className={`${menuItem} cursor-pointer disabled:cursor-wait disabled:opacity-70`}
					>
						{isSubmitting ? "Logging out…" : "Log out"}
					</button>
					{failed ? (
						<p
							role="alert"
							className="rounded bg-light-apricot px-2 py-1 text-xs whitespace-nowrap text-dark-wine"
						>
							Log out failed. Try again.
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
}
