"use client";

import { useEffect, useRef, useState } from "react";
import { useLogout } from "./logout-button";

// drops down a "log out" button.
export default function AccountMenu({ name }: { name: string }) {
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
				aria-haspopup="true"
				className="flex items-center gap-2.5 text-sm leading-[1.45] font-medium whitespace-nowrap text-sand hover:text-light-apricot cursor-pointer"
			>
				Hello, {name}
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					aria-hidden="true"
					className={`transition-transform ${open ? "rotate-180" : ""}`}
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
				<div className="absolute top-full right-0 z-40 mt-2 flex flex-col items-end gap-1">
					<button
						type="button"
						onClick={logout}
						disabled={isSubmitting}
						className="h-[31px] w-[95px] rounded-[5px] border border-taupe bg-soft-fawn text-sm text-coffee-bean hover:bg-camel disabled:cursor-wait disabled:opacity-70 cursor-pointer"
					>
						{isSubmitting ? "logging out…" : "log out"}
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
