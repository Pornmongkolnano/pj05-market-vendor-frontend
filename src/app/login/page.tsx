import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "สมัครสมาชิกสำเร็จ | ระบบจองพื้นที่ตลาดกลางคืน",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string | string[] }>;
}) {
  const { registered } = await searchParams;
  if (registered !== "1") {
    redirect("/register");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl leading-snug font-semibold">สมัครสมาชิกสำเร็จ</h1>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-11 items-center rounded text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          กลับหน้าแรก
        </Link>
      </section>
    </main>
  );
}
