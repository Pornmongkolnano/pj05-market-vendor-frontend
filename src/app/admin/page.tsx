import Link from "next/link";
import { requireViewer } from "@/lib/auth";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireViewer("/admin", "admin");
  const { account } = await searchParams;

  return (
    <main className="page-shell">
      <Link href="/account" className="text-sm underline underline-offset-4">
        กลับบัญชีของฉัน
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">จัดการตลาด</h1>
      {account === "created" ? (
        <p role="status" className="mt-4 rounded-md bg-emerald-50 p-3 text-emerald-900">
          สร้างบัญชีสำเร็จ
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/spots" className="button-primary">
          จัดการพื้นที่ขาย
        </Link>
        <Link href="/admin/bookings" className="button-secondary">
          การจองทั้งหมด
        </Link>
        <Link href="/admin/dashboard" className="button-secondary">
          แดชบอร์ดตลาด
        </Link>
        <Link href="/register" className="button-secondary">
          สร้างบัญชี
        </Link>
      </div>
    </main>
  );
}
