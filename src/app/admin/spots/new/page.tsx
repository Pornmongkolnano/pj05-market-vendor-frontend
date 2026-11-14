import Link from "next/link";
import SpotForm from "@/components/spot-form";
import { requireViewer } from "@/lib/auth";
import { saveSpot } from "../actions";

export default async function NewSpotPage() {
  await requireViewer("/admin/spots/new", "admin");
  return (
    <main className="page-shell">
      <Link href="/admin/spots" className="text-link text-sm">
        กลับหน้าจัดการพื้นที่ขาย
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">เพิ่มพื้นที่ขาย</h1>
      <SpotForm action={saveSpot.bind(null, null)} />
    </main>
  );
}
