import Link from "next/link";
import { getSessionViewer } from "@/lib/auth";

export default async function Home() {
  const viewer = await getSessionViewer();

  return (
    <main className="page-shell">
      <h1 className="text-3xl font-semibold">ระบบจองพื้นที่ตลาดกลางคืน</h1>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link href="/spots" className="button-primary">
          ดูพื้นที่ขาย
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
