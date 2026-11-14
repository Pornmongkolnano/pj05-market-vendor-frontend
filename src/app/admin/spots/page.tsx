import Link from "next/link";
import DeleteConfirmation from "@/components/delete-confirmation";
import { requireViewer } from "@/lib/auth";
import { formatFee } from "@/lib/market";
import { listSpots } from "@/lib/market-data";
import { deactivateSpot } from "./actions";

const notices: Record<string, string> = {
  created: "เพิ่มพื้นที่ขายแล้ว",
  updated: "บันทึกการแก้ไขพื้นที่แล้ว",
  deactivated: "ปิดใช้งานพื้นที่แล้ว",
};

export default async function AdminSpotsPage({
  searchParams,
}: PageProps<"/admin/spots">) {
  await requireViewer("/admin/spots", "admin");
  const [spots, { result }] = await Promise.all([listSpots(), searchParams]);
  const notice =
    typeof result === "string" && Object.hasOwn(notices, result)
      ? notices[result]
      : null;
  return (
    <main className="page-shell">
      <Link href="/admin" className="text-link text-sm">
        กลับหน้าจัดการตลาด
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">จัดการพื้นที่ขาย</h1>
        <Link href="/admin/spots/new" className="button-primary">
          เพิ่มพื้นที่ขาย
        </Link>
      </div>
      {notice ? (
        <p
          role="status"
          className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900"
        >
          {notice}
        </p>
      ) : null}
      {spots.length ? (
        <ul className="mt-6 space-y-4">
          {spots.map((spot) => (
            <li
              key={spot._id}
              className="panel flex flex-wrap items-start justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  แผง {spot.spotNumber} · โซน {spot.zone}
                </h2>
                <p className="mt-1 text-sm">
                  {spot.spotSize} · {formatFee(spot.rentalFee)} / วัน
                </p>
                <p className="mt-1 wrap-break-word text-sm text-slate-600">
                  {spot.locationDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/spots/${spot._id}`} className="button-secondary">
                  ดูรายละเอียด
                </Link>
                <Link
                  href={`/admin/spots/${spot._id}/edit`}
                  className="button-secondary"
                >
                  แก้ไข
                </Link>
                <DeleteConfirmation
                  label="ปิดใช้งาน"
                  prompt={`ยืนยันปิดใช้งานแผง ${spot.spotNumber} หรือไม่`}
                  action={deactivateSpot.bind(null, spot._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-slate-600">ยังไม่มีพื้นที่ที่เปิดใช้งาน</p>
      )}
    </main>
  );
}
