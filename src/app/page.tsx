import Link from "next/link";
import { getSessionViewer } from "@/lib/auth";

export default async function Home() {
  const viewer = await getSessionViewer();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">ระบบจองพื้นที่ตลาดกลางคืน</h1>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={viewer ? "/account" : "/login"}
          className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-5 font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {viewer ? "บัญชีของฉัน" : "เข้าสู่ระบบ"}
        </Link>
        {viewer ? null : (
          <Link
            href="/register"
            className="font-medium underline underline-offset-4"
          >
            สมัครสมาชิก
          </Link>
        )}
      </div>
    </main>
  );
}
