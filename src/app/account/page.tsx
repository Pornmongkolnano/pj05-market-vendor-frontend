import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";
import { requireViewer } from "@/lib/auth";

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const { from } = await searchParams;
  const fromLogin = from === "login";
  const { viewer } = await requireViewer(
    fromLogin ? "/account?from=login" : "/account",
  );
  if (viewer.role === "member") redirect("/bookings");
  if (fromLogin) redirect("/admin/dashboard");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">บัญชีของฉัน</h1>
      <p className="mt-3">{viewer.name}</p>
      <p className="mt-1 text-sm text-slate-700">ผู้ดูแลระบบ</p>
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-4 font-medium text-white"
        >
          สร้างบัญชี
        </Link>
        <LogoutButton />
      </div>
    </main>
  );
}
