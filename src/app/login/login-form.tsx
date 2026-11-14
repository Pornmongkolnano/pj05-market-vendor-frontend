"use client";

import { signIn } from "next-auth/react";
import { type SubmitEvent, useState } from "react";

const unavailable = "เข้าสู่ระบบไม่ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
const inputStyle =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-slate-500 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

export default function LoginForm({ destination }: { destination: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const data = new FormData(event.currentTarget);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        email: data.get("email"),
        password: data.get("password"),
        redirect: false,
        callbackUrl: destination,
      });

      if (response?.ok && !response.error) {
        window.location.replace(destination);
        return;
      }

      if (response?.error === "CredentialsSignin") {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (response?.error === "RateLimited") {
        setError("มีคำขอเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง");
      } else {
        setError(unavailable);
      }
    } catch {
      setError(unavailable);
    }
    setIsSubmitting(false);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium">
          อีเมล
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          readOnly={isSubmitting}
          className={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium">
          รหัสผ่าน
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          readOnly={isSubmitting}
          className={inputStyle}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white enabled:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-70"
      >
        {isSubmitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
      <div role="status">
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-900">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
