import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <h1 className="text-2xl font-semibold">ไม่พบข้อมูลที่ขอ</h1>
      <Link href="/spots" className="text-link mt-4 inline-block">
        ดูพื้นที่ขายทั้งหมด
      </Link>
    </main>
  );
}
