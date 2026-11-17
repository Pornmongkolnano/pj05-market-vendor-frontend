"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

const defaultLabels = {
  idle: "ออกจากระบบ",
  busy: "กำลังออกจากระบบ…",
  failed: "ออกจากระบบไม่ได้ กรุณาลองใหม่อีกครั้ง",
};

export default function LogoutButton({
  className = "min-h-11 rounded-lg border border-slate-400 bg-white px-4 font-medium hover:bg-slate-100 disabled:opacity-70",
  labels = defaultLabels,
}: {
  className?: string;
  labels?: typeof defaultLabels;
}) {
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

  return (
    <div>
      <button
        type="button"
        onClick={logout}
        disabled={isSubmitting}
        className={className}
      >
        {isSubmitting ? labels.busy : labels.idle}
      </button>
      {failed ? (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {labels.failed}
        </p>
      ) : null}
    </div>
  );
}
