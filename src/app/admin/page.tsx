import Link from "next/link";
import { requireViewer } from "@/lib/auth";

export default async function AdminPage() {
  await requireViewer("/admin", "admin");

  return (
    <main className="page-shell">
      <Link href="/account" className="text-sm underline underline-offset-4">
        กลับบัญชีของฉัน
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">จัดการตลาด</h1>
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
      </div>
    </main>
  );
}
