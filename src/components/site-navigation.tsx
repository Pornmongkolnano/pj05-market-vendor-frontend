import Link from "next/link";
import { getSessionViewer } from "@/lib/auth";

export default async function SiteNavigation() {
  const viewer = await getSessionViewer();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="เมนูหลัก"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-5 gap-y-1 px-4 py-2 sm:px-6"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-semibold"
        >
          ตลาดกลางคืน
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <Link
            href="/spots"
            className="inline-flex min-h-11 items-center hover:underline"
          >
            พื้นที่ขาย
          </Link>
          {viewer?.role === "member" ? (
            <Link
              href="/bookings"
              className="inline-flex min-h-11 items-center hover:underline"
            >
              การจองของฉัน
            </Link>
          ) : null}
          {viewer?.role === "admin" ? (
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center hover:underline"
            >
              จัดการตลาด
            </Link>
          ) : null}
          <Link
            href={viewer ? "/account" : "/login"}
            className="inline-flex min-h-11 items-center hover:underline"
          >
            {viewer ? "บัญชีของฉัน" : "เข้าสู่ระบบ"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
