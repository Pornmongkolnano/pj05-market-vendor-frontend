import { redirect } from "next/navigation";
import MyBookings from "@/components/my-bookings";
import { requireViewer } from "@/lib/auth";
import { listBookings } from "@/lib/market-data";

const notices: Record<string, string> = {
  created: "Spot booked. See it below.",
  updated: "Your booking was updated.",
  deleted: "Your booking was cancelled.",
};

export default async function BookingsPage({
  searchParams,
}: PageProps<"/bookings">) {
  const { viewer, backendToken } = await requireViewer("/bookings");
  if (viewer.role === "admin") redirect("/admin/bookings");
  const [bookings, { result }] = await Promise.all([
    listBookings(backendToken, "/bookings"),
    searchParams,
  ]);
  const notice =
    typeof result === "string" && Object.hasOwn(notices, result)
      ? notices[result]
      : null;

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
      <MyBookings bookings={bookings} today={today} />
    </main>
  );
}
