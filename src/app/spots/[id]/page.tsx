import Link from "next/link";
import { getSessionViewer, loginPath } from "@/lib/auth";
import { formatFee } from "@/lib/market";
import { readSpot } from "@/lib/market-data";

export default async function SpotPage({ params }: PageProps<"/spots/[id]">) {
  const { id } = await params;
  const [spot, viewer] = await Promise.all([readSpot(id), getSessionViewer()]);
  const bookingPath = `/bookings/new?spot=${id}`;

  return (
    <main className="page-shell">
      <Link href="/spots" className="text-link inline-block text-sm">
        กลับรายการพื้นที่ขาย
      </Link>
      <div className="panel mt-4 max-w-xl">
        <h1 className="text-3xl font-semibold">แผง {spot.spotNumber}</h1>
        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <dt className="text-slate-600">โซน</dt>
          <dd>{spot.zone}</dd>
          <dt className="text-slate-600">ขนาดพื้นที่</dt>
          <dd>{spot.spotSize}</dd>
          <dt className="text-slate-600">ตำแหน่ง</dt>
          <dd className="wrap-break-word">{spot.locationDescription}</dd>
          <dt className="text-slate-600">ค่าเช่าต่อวัน</dt>
          <dd>{formatFee(spot.rentalFee)}</dd>
        </dl>
        {viewer?.role === "admin" ? (
          <Link
            href={`/admin/spots/${id}/edit`}
            className="button-secondary mt-6"
          >
            แก้ไขพื้นที่
          </Link>
        ) : (
          <Link
            href={viewer ? bookingPath : loginPath(bookingPath)}
            className="button-primary mt-6"
          >
            {viewer ? "จองพื้นที่นี้" : "เข้าสู่ระบบเพื่อจอง"}
          </Link>
        )}
      </div>
    </main>
  );
}
