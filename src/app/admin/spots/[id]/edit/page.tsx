import Link from "next/link";
import SpotForm from "@/components/spot-form";
import { requireViewer } from "@/lib/auth";
import { readSpot } from "@/lib/market-data";
import { saveSpot } from "../../actions";

export default async function EditSpotPage({
  params,
}: PageProps<"/admin/spots/[id]/edit">) {
  const { id } = await params;
  await requireViewer(`/admin/spots/${id}/edit`, "admin");
  const spot = await readSpot(id);
  return (
    <main className="page-shell">
      <Link href="/admin/spots" className="text-link text-sm">
        กลับหน้าจัดการพื้นที่ขาย
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">แก้ไขพื้นที่ขาย</h1>
      <SpotForm action={saveSpot.bind(null, id)} spot={spot} />
    </main>
  );
}
