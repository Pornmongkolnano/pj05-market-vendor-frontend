import Link from "next/link";
import { requireViewer } from "@/lib/auth";

export default async function AdminPage() {
  await requireViewer("/admin", "admin");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/account" className="text-sm underline underline-offset-4">
        กลับบัญชีของฉัน
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">จัดการตลาด</h1>
    </main>
  );
}
