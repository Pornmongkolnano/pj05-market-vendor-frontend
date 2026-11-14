import Link from "next/link";
import { updateBooking } from "@/app/bookings/actions";
import { requireViewer } from "@/lib/auth";
import { listSpots, readBooking } from "@/lib/market-data";
import BookingForm from "./booking-form";

export default async function EditBooking({
  id,
  admin,
}: {
  id: string;
  admin: boolean;
}) {
  const list = admin ? "/admin/bookings" : "/bookings";
  const page = `${list}/${id}/edit`;
  const { backendToken } = await requireViewer(
    page,
    admin ? "admin" : "member",
  );
  const [booking, spots] = await Promise.all([
    readBooking(id, backendToken, page),
    listSpots(),
  ]);
  const spotOptions = spots.map((spot) => ({
    id: spot._id,
    label: `แผง ${spot.spotNumber} · โซน ${spot.zone}`,
  }));
  const selectedSpot = spots.find((spot) => spot._id === booking.spot?._id);

  return (
    <main className="page-shell">
      <Link href={list} className="text-link text-sm">
        กลับรายการจอง
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">แก้ไขการจอง</h1>
      {admin && booking.user ? (
        <p className="mt-2 text-sm text-slate-600">ผู้จอง {booking.user.name}</p>
      ) : null}
      {!selectedSpot ? (
        <p className="mt-3 text-sm text-amber-800">
          พื้นที่เดิมปิดใช้งาน กรุณาเลือกพื้นที่ใหม่
        </p>
      ) : null}
      <BookingForm
        action={updateBooking.bind(null, id, admin)}
        spots={spotOptions}
        initial={{
          spot: selectedSpot?._id ?? "",
          bookingDate: booking.bookingDate.slice(0, 10),
          productType: booking.productType,
        }}
        cancelPath={list}
        submitLabel="บันทึกการแก้ไข"
      />
    </main>
  );
}
