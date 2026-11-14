import Link from "next/link";
import BookingList from "@/components/booking-list";
import { requireViewer } from "@/lib/auth";
import { listBookings } from "@/lib/market-data";

export default async function AdminBookingsPage({
  searchParams,
}: PageProps<"/admin/bookings">) {
  const { backendToken } = await requireViewer("/admin/bookings", "admin");
  const [bookings, { result }] = await Promise.all([
    listBookings(backendToken, "/admin/bookings"),
    searchParams,
  ]);
  return (
    <main className="page-shell">
      <Link href="/admin" className="text-link text-sm">
        กลับหน้าจัดการตลาด
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">การจองทั้งหมด</h1>
      <BookingList bookings={bookings} result={result} admin />
    </main>
  );
}
