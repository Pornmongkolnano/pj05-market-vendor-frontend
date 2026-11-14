import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "สมัครสมาชิก | ระบบจองพื้นที่ตลาดกลางคืน",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          กลับหน้าแรก
        </Link>
        <section
          aria-labelledby="register-title"
          className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h1
            id="register-title"
            className="text-3xl leading-snug font-semibold"
          >
            สมัครสมาชิก
          </h1>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
