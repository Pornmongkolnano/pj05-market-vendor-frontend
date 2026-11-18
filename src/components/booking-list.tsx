import Link from "next/link";
import { deleteBooking } from "@/app/bookings/actions";
import { type Booking, formatBookingDate } from "@/lib/market";
import AdminBookingDelete from "./admin-booking-delete";
import DeleteConfirmation from "./delete-confirmation";

const notices: Record<string, string> = {
  created: "จองพื้นที่สำเร็จ",
  updated: "บันทึกการแก้ไขการจองแล้ว",
  deleted: "ลบการจองแล้ว",
};

export default function BookingList({
  bookings,
  result,
  admin = false,
}: {
  bookings: Booking[];
  result?: string | string[];
  admin?: boolean;
}) {
  const list = admin ? "/admin/bookings" : "/bookings";
  const notice =
    typeof result === "string" && Object.hasOwn(notices, result)
      ? notices[result]
      : null;

  return (
    <>
      {notice ? (
        <p
          role="status"
          className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900"
        >
          {notice}
        </p>
      ) : null}
      {bookings.length === 0 ? (
        <p className="mt-5 text-slate-600">ยังไม่มีรายการจอง</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="panel flex flex-wrap items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">
                  {booking.spot
                    ? `แผง ${booking.spot.spotNumber} · โซน ${booking.spot.zone}`
                    : "พื้นที่ไม่พร้อมใช้งาน"}
                </h2>
                {booking.spot?.isActive === false ? (
                  <p className="text-sm text-amber-800">พื้นที่ปิดใช้งาน</p>
                ) : null}
                <p className="mt-1 text-sm">
                  {formatBookingDate(booking.bookingDate)}
                </p>
                <p className="mt-1 wrap-break-word text-sm">
                  ประเภทสินค้า {booking.productType}
                </p>
                {admin ? (
                  <p className="mt-1 wrap-break-word text-sm text-slate-600">
                    ผู้จอง {booking.user?.name ?? "ไม่พบบัญชี"}{" "}
                    {booking.user ? `(${booking.user.email})` : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`${list}/${booking._id}/edit`}
                  className="button-secondary"
                >
                  แก้ไข
                </Link>
                {admin ? (
                  <AdminBookingDelete
                    action={deleteBooking.bind(null, booking._id, true)}
                    bookingDate={booking.bookingDate}
                    spotNumber={booking.spot?.spotNumber}
                  />
                ) : (
                  <DeleteConfirmation
                    label="ลบการจอง"
                    prompt="ยืนยันลบรายการจองนี้หรือไม่"
                    action={deleteBooking.bind(null, booking._id, false)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
