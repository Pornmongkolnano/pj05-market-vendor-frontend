import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import { requireViewer } from "@/lib/auth";

export default async function AccountPage() {
  const { viewer } = await requireViewer("/account");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">บัญชีของฉัน</h1>
      <p className="mt-3">{viewer.name}</p>
      <p className="mt-1 text-sm text-slate-700">
        {viewer.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"}
      </p>
      <div className="mt-6 flex flex-wrap items-start gap-4">
        {viewer.role === "admin" ? (
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-4 font-medium text-white"
          >
            จัดการตลาด
          </Link>
        ) : (
          <Link href="/bookings" className="button-primary">
            การจองของฉัน
          </Link>
        )}
        <LogoutButton />
      </div>
    </main>
  );
}
