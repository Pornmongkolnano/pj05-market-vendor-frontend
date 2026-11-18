"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function useLogout() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [failed, setFailed] = useState(false);

	async function logout() {
		if (isSubmitting) return;

		setFailed(false);
		setIsSubmitting(true);
		try {
			const response = await signOut({
				callbackUrl: "/login",
				redirect: false,
			});
			const destination = new URL(response.url, window.location.href);
			if (destination.pathname !== "/login") {
				throw new Error("NextAuth did not complete sign-out");
			}
			window.location.replace("/login");
		} catch {
			setFailed(true);
			setIsSubmitting(false);
		}
	}

	return { logout, isSubmitting, failed };
}
