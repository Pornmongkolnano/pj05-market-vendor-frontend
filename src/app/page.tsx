import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">ระบบจองพื้นที่ตลาดกลางคืน</h1>
      <Link
        href="/register"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-5 font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        สมัครสมาชิก
      </Link>
    </main>
  );
}
