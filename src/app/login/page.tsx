import type { Metadata } from "next";
import Link from "next/link";
import { loginDestination } from "@/lib/auth-types";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | ระบบจองพื้นที่ตลาดกลางคืน",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    registered?: string | string[];
    next?: string | string[];
    callbackUrl?: string | string[];
  }>;
}) {
  const { registered, next, callbackUrl } = await searchParams;
  const destination = loginDestination(next ?? callbackUrl) || "/account";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl leading-snug font-semibold">เข้าสู่ระบบ</h1>
        {registered === "1" ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
            สมัครสมาชิกสำเร็จ เข้าสู่ระบบได้เลย
          </p>
        ) : null}
        <LoginForm destination={destination} />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href="/register"
            className="font-medium underline underline-offset-4"
          >
            สมัครสมาชิก
          </Link>
          <Link href="/" className="underline underline-offset-4">
            กลับหน้าแรก
          </Link>
        </div>
      </section>
    </main>
  );
}
