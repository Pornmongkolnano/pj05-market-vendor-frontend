import MyBookings from "@/components/my-bookings";
import { requireViewer } from "@/lib/auth";
import { listBookings } from "@/lib/market-data";

const notices: Record<string, string> = {
  updated: "Booking updated.",
  deleted: "Booking cancelled. The spot is free again for that date.",
};

export default async function AdminBookingsPage({
  searchParams,
}: PageProps<"/admin/bookings">) {
  // Admins only. With an admin token, GET /bookings returns every member's bookings.
  const { backendToken } = await requireViewer("/admin/bookings", "admin");
  const [bookings, { result }] = await Promise.all([
    listBookings(backendToken, "/admin/bookings"),
    searchParams,
  ]);
  const notice =
    typeof result === "string" && Object.hasOwn(notices, result)
      ? notices[result]
      : null;

  // "Today" in UTC as in the backend
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="flex flex-col gap-6 px-4 pt-[30px] pb-16 sm:px-8 lg:px-16">
      {notice ? (
        <p
          role="status"
          className="rounded-md bg-linen px-[18px] py-3 text-sm font-medium text-dark-wine"
        >
          {notice}
        </p>
      ) : null}
      {/* Same screen as My bookings, with the vendor's name added */}
      <MyBookings bookings={bookings} today={today} admin />
    </main>
  );
}
