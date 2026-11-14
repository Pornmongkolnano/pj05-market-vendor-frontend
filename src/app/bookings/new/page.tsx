import Link from "next/link";
import BookingForm from "@/components/booking-form";
import { requireViewer } from "@/lib/auth";
import { isObjectId } from "@/lib/market";
import { listSpots } from "@/lib/market-data";
import { createBooking } from "../actions";

export default async function NewBookingPage({
  searchParams,
}: PageProps<"/bookings/new">) {
  const { spot } = await searchParams;
  const selectedId = typeof spot === "string" && isObjectId(spot) ? spot : "";
  const path = selectedId
    ? `/bookings/new?spot=${selectedId}`
    : "/bookings/new";
  await requireViewer(path, "member");

  const spots = await listSpots();
  const selectedSpot = spots.find((entry) => entry._id === selectedId);
  const cancelPath = selectedSpot ? `/spots/${selectedId}` : "/spots";
  return (
    <main className="page-shell">
      <Link href={cancelPath} className="text-link text-sm">
        กลับหน้าพื้นที่ขาย
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">จองพื้นที่ขาย</h1>
      {spots.length ? (
        <BookingForm
          action={createBooking}
          spots={spots.map((entry) => ({
            id: entry._id,
            label: `แผง ${entry.spotNumber} · โซน ${entry.zone}`,
          }))}
          initial={{
            spot: selectedSpot?._id ?? "",
            bookingDate: new Date().toISOString().slice(0, 10),
            productType: "",
          }}
          cancelPath={cancelPath}
          submitLabel="ยืนยันการจอง"
        />
      ) : (
        <p className="mt-5 text-slate-600">ยังไม่มีพื้นที่ที่เปิดให้จอง</p>
      )}
    </main>
  );
}
