import Link from "next/link";
import BookingList from "@/components/booking-list";
import { requireViewer } from "@/lib/auth";
import { listBookings } from "@/lib/market-data";

export default async function BookingsPage({
  searchParams,
}: PageProps<"/bookings">) {
  const { backendToken } = await requireViewer("/bookings", "member");
  const [bookings, { result }] = await Promise.all([
    listBookings(backendToken, "/bookings"),
    searchParams,
  ]);
  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">การจองของฉัน</h1>
        <Link href="/spots" className="button-primary">
          เลือกพื้นที่ขาย
        </Link>
      </div>
      <BookingList bookings={bookings} result={result} />
    </main>
  );
}
