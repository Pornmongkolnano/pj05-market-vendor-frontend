import Link from "next/link";
import { formatFee } from "@/lib/market";
import { listSpots } from "@/lib/market-data";

export default async function SpotsPage() {
  const spots = await listSpots();

  return (
    <main className="page-shell">
      <h1 className="text-3xl font-semibold">พื้นที่ขาย</h1>
      {spots.length === 0 ? (
        <p className="mt-5 text-slate-600">ยังไม่มีพื้นที่ที่เปิดให้จอง</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <li key={spot._id} className="panel flex flex-col items-start">
              <h2 className="text-xl font-semibold">แผง {spot.spotNumber}</h2>
              <p className="mt-1 text-sm text-slate-600">
                โซน {spot.zone} · {spot.spotSize}
              </p>
              <p className="my-3 flex-1 wrap-break-word text-sm">
                {spot.locationDescription}
              </p>
              <p className="font-medium">{formatFee(spot.rentalFee)} / วัน</p>
              <Link
                href={`/spots/${spot._id}`}
                className="button-secondary mt-4"
                aria-label={`ดูแผง ${spot.spotNumber} โซน ${spot.zone}`}
              >
                ดูรายละเอียด
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
