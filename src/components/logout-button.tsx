"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function logout() {
    setFailed(false);
    setIsSubmitting(true);
    try {
      await signOut({ callbackUrl: "/login", redirect: false });
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
        className="min-h-11 rounded-lg border border-slate-400 bg-white px-4 font-medium hover:bg-slate-100 disabled:opacity-70"
      >
        {isSubmitting ? "กำลังออกจากระบบ…" : "ออกจากระบบ"}
      </button>
      {failed ? (
        <p role="alert" className="mt-2 text-sm text-red-800">
          ออกจากระบบไม่ได้ กรุณาลองใหม่อีกครั้ง
        </p>
      ) : null}
    </div>
  );
}
