import { redirect } from "next/navigation";
import BookingForm from "@/components/booking-form";
import BookingPage from "@/components/booking-page";
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
  const { viewer } = await requireViewer(path);
  if (viewer.role === "admin") redirect("/admin/dashboard");

  const spots = await listSpots();
  const selectedSpot = spots.find((entry) => entry._id === selectedId);
  return (
    <BookingPage title="Book a spot">
      {spots.length ? (
        <BookingForm
          action={createBooking}
          spots={spots}
          initial={{
            spot: selectedSpot?._id ?? "",
            bookingDate: new Date().toISOString().slice(0, 10),
            productType: "",
          }}
          cancelPath="/spots"
          submitLabel="Book spot"
        />
      ) : (
        <p className="mt-6 rounded-lg border border-line bg-paper px-5 py-4 text-sm text-taupe">
          There are no spots available to book.
        </p>
      )}
    </BookingPage>
  );
}
